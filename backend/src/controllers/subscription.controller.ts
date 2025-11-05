import { Response, Request } from 'express';
import { PrismaClient, SubscriptionTier } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const TIER_PRICES: Record<SubscriptionTier, number> = {
  BASIC: 1000,      // 1000 HUF/month
  PREMIUM: 3000,    // 3000 HUF/month
  SUPPORTER: 10000, // 10000 HUF/month
};

export const createSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { tier, shelterId } = req.body;

  if (!Object.values(SubscriptionTier).includes(tier)) {
    throw new AppError('Invalid subscription tier', 400);
  }

  // Check if shelter exists
  const shelter = await prisma.shelter.findUnique({
    where: { id: shelterId },
  });

  if (!shelter) {
    throw new AppError('Shelter not found', 404);
  }

  // Create or get Stripe customer
  let stripeCustomerId: string;
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Create Stripe customer
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: {
      userId: user.id,
      shelterId,
    },
  });

  stripeCustomerId = customer.id;

  // Create Stripe subscription
  const stripeSubscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [
      {
        price_data: {
          currency: 'huf',
          product_data: {
            name: `${tier} Subscription`,
            description: `Monthly subscription to support ${shelter.name}`,
          },
          unit_amount: TIER_PRICES[tier as SubscriptionTier],
          recurring: {
            interval: 'month',
          },
        },
      },
    ],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });

  // Save subscription to database
  const subscription = await prisma.subscription.create({
    data: {
      tier: tier as SubscriptionTier,
      status: 'ACTIVE',
      amount: TIER_PRICES[tier as SubscriptionTier] / 100,
      currency: 'HUF',
      stripeCustomerId,
      stripeSubscriptionId: stripeSubscription.id,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      userId: req.user!.id,
      shelterId,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      subscription,
      clientSecret: (stripeSubscription.latest_invoice as any)?.payment_intent?.client_secret,
    },
  });
});

export const getSubscriptions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      OR: [
        { userId: req.user!.id },
        { shelter: { userId: req.user!.id } },
      ],
    },
    include: {
      shelter: {
        select: {
          id: true,
          name: true,
          logo: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    status: 'success',
    data: { subscriptions },
  });
});

export const cancelSubscription = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const subscription = await prisma.subscription.findUnique({
    where: { id },
  });

  if (!subscription) {
    throw new AppError('Subscription not found', 404);
  }

  if (subscription.userId !== req.user!.id) {
    throw new AppError('Unauthorized', 403);
  }

  // Cancel in Stripe
  if (subscription.stripeSubscriptionId) {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  }

  // Update in database
  const updatedSubscription = await prisma.subscription.update({
    where: { id },
    data: {
      cancelAtPeriodEnd: true,
    },
  });

  res.json({
    status: 'success',
    data: { subscription: updatedSubscription },
  });
});

export const stripeWebhook = asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    throw new AppError('No signature', 400);
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    throw new AppError(`Webhook Error: ${err}`, 400);
  }

  // Handle the event
  switch (event.type) {
    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      const subId = invoice.subscription as string;

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subId },
        data: { status: 'ACTIVE' },
      });
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      const failedSubId = failedInvoice.subscription as string;

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: failedSubId },
        data: { status: 'PAST_DUE' },
      });
      break;

    case 'customer.subscription.deleted':
      const deletedSub = event.data.object as Stripe.Subscription;

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: deletedSub.id },
        data: { status: 'CANCELLED' },
      });
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

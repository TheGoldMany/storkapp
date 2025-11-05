import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export const createDonation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { shelterId, amount, message, anonymous } = req.body;

  if (!amount || amount < 100) {
    throw new AppError('Minimum donation amount is 100 HUF', 400);
  }

  const shelter = await prisma.shelter.findUnique({
    where: { id: shelterId },
  });

  if (!shelter) {
    throw new AppError('Shelter not found', 404);
  }

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount),
    currency: 'huf',
    metadata: {
      shelterId,
      userId: req.user!.id,
      type: 'donation',
    },
    description: `Donation to ${shelter.name}`,
  });

  // Create donation record
  const donation = await prisma.donation.create({
    data: {
      amount: amount / 100,
      currency: 'HUF',
      message,
      anonymous: anonymous || false,
      stripePaymentId: paymentIntent.id,
      stripeStatus: paymentIntent.status,
      userId: req.user!.id,
      shelterId,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      donation,
      clientSecret: paymentIntent.client_secret,
    },
  });
});

export const getDonations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const donations = await prisma.donation.findMany({
    where: { userId: req.user!.id },
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
    data: { donations },
  });
});

export const getShelterDonations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { shelterId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const where: any = {
    shelterId,
    stripeStatus: 'succeeded',
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [donations, total, totalAmount] = await Promise.all([
    prisma.donation.findMany({
      where,
      skip,
      take: Number(limit),
      select: {
        id: true,
        amount: true,
        currency: true,
        message: true,
        anonymous: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.donation.count({ where }),
    prisma.donation.aggregate({
      where,
      _sum: { amount: true },
    }),
  ]);

  // Hide user info for anonymous donations
  const sanitizedDonations = donations.map(d => ({
    ...d,
    user: d.anonymous ? null : d.user,
  }));

  res.json({
    status: 'success',
    data: {
      donations: sanitizedDonations,
      totalAmount: totalAmount._sum.amount || 0,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

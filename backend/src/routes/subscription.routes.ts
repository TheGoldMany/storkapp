import { Router } from 'express';
import {
  createSubscription,
  getSubscriptions,
  cancelSubscription,
  stripeWebhook,
} from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth';

export const subscriptionRouter = Router();

// Webhook route (no auth, Stripe signature verification)
subscriptionRouter.post('/webhook', stripeWebhook);

// Protected routes
subscriptionRouter.use(authenticate);

subscriptionRouter.post('/', createSubscription);
subscriptionRouter.get('/', getSubscriptions);
subscriptionRouter.delete('/:id', cancelSubscription);

import { Router } from 'express';
import {
  createDonation,
  getDonations,
  getShelterDonations,
} from '../controllers/donation.controller';
import { authenticate } from '../middleware/auth';

export const donationRouter = Router();

// Public routes
donationRouter.get('/shelter/:shelterId', getShelterDonations);

// Protected routes
donationRouter.use(authenticate);
donationRouter.post('/', createDonation);
donationRouter.get('/', getDonations);

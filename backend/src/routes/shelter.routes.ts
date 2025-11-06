import { Router } from 'express';
import {
  createShelter,
  getShelters,
  getShelterById,
  updateShelter,
  deleteShelter,
  getMyShelter,
} from '../controllers/shelter.controller';
import { authenticate, authorize } from '../middleware/auth';


export const shelterRouter = Router();

// Public routes
shelterRouter.get('/', getShelters);

// Protected routes (must come before :id route to avoid conflicts)
shelterRouter.get('/my', authenticate, getMyShelter);

shelterRouter.get('/:id', getShelterById);

shelterRouter.use(authenticate);
shelterRouter.post('/', authorize('USER', 'SHELTER_ADMIN'), createShelter);
shelterRouter.put('/:id', authorize('SHELTER_ADMIN', 'ADMIN'), updateShelter);
shelterRouter.delete('/:id', authorize('SHELTER_ADMIN', 'ADMIN'), deleteShelter);

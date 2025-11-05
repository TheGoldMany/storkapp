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
shelterRouter.get('/:id', getShelterById);

// Protected routes
shelterRouter.use(authenticate);

shelterRouter.get('/me/shelter', getMyShelter);
shelterRouter.post('/', authorize('USER', 'SHELTER_ADMIN'), createShelter);
shelterRouter.put('/:id', authorize('SHELTER_ADMIN', 'ADMIN'), updateShelter);
shelterRouter.delete('/:id', authorize('SHELTER_ADMIN', 'ADMIN'), deleteShelter);

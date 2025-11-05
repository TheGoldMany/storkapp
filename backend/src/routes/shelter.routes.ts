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
import { UserRole } from '../types/prisma';

export const shelterRouter = Router();

// Public routes
shelterRouter.get('/', getShelters);
shelterRouter.get('/:id', getShelterById);

// Protected routes
shelterRouter.use(authenticate);

shelterRouter.get('/me/shelter', getMyShelter);
shelterRouter.post('/', authorize(UserRole.USER, UserRole.SHELTER_ADMIN), createShelter);
shelterRouter.put('/:id', authorize(UserRole.SHELTER_ADMIN, UserRole.ADMIN), updateShelter);
shelterRouter.delete('/:id', authorize(UserRole.SHELTER_ADMIN, UserRole.ADMIN), deleteShelter);

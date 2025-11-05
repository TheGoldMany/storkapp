import { Router } from 'express';
import {
  createAnimal,
  getAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
} from '../controllers/animal.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types/prisma';

export const animalRouter = Router();

// Public routes
animalRouter.get('/', getAnimals);
animalRouter.get('/:id', getAnimalById);

// Protected routes (shelter admins)
animalRouter.use(authenticate);
animalRouter.post('/', authorize(UserRole.SHELTER_ADMIN, UserRole.ADMIN), createAnimal);
animalRouter.put('/:id', authorize(UserRole.SHELTER_ADMIN, UserRole.ADMIN), updateAnimal);
animalRouter.delete('/:id', authorize(UserRole.SHELTER_ADMIN, UserRole.ADMIN), deleteAnimal);

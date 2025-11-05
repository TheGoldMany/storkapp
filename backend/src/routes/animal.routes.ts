import { Router } from 'express';
import {
  createAnimal,
  getAnimals,
  getAnimalById,
  updateAnimal,
  deleteAnimal,
} from '../controllers/animal.controller';
import { authenticate, authorize } from '../middleware/auth';

export const animalRouter = Router();

// Public routes
animalRouter.get('/', getAnimals);
animalRouter.get('/:id', getAnimalById);

// Protected routes (shelter admins)
animalRouter.use(authenticate);
animalRouter.post('/', authorize('SHELTER_ADMIN', 'ADMIN'), createAnimal);
animalRouter.put('/:id', authorize('SHELTER_ADMIN', 'ADMIN'), updateAnimal);
animalRouter.delete('/:id', authorize('SHELTER_ADMIN', 'ADMIN'), deleteAnimal);

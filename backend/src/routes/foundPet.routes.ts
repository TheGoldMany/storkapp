import { Router } from 'express';
import {
  createFoundPet,
  getFoundPets,
  getFoundPetById,
  updateFoundPet,
  deleteFoundPet,
  getMyFoundPets,
} from '../controllers/foundPet.controller';
import { authenticate } from '../middleware/auth';

export const foundPetRouter = Router();

// Public routes
foundPetRouter.get('/', getFoundPets);
foundPetRouter.get('/:id', getFoundPetById);

// Protected routes
foundPetRouter.use(authenticate);
foundPetRouter.post('/', createFoundPet);
foundPetRouter.get('/me/found-pets', getMyFoundPets);
foundPetRouter.put('/:id', updateFoundPet);
foundPetRouter.delete('/:id', deleteFoundPet);

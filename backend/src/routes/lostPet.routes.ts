import { Router } from 'express';
import {
  createLostPet,
  getLostPets,
  getLostPetById,
  updateLostPet,
  deleteLostPet,
  getMyLostPets,
} from '../controllers/lostPet.controller';
import { authenticate } from '../middleware/auth';

export const lostPetRouter = Router();

// Public routes
lostPetRouter.get('/', getLostPets);
lostPetRouter.get('/:id', getLostPetById);

// Protected routes
lostPetRouter.use(authenticate);
lostPetRouter.post('/', createLostPet);
lostPetRouter.get('/me/lost-pets', getMyLostPets);
lostPetRouter.put('/:id', updateLostPet);
lostPetRouter.delete('/:id', deleteLostPet);

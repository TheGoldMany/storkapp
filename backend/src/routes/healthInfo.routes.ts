import { Router } from 'express';
import {
  createHealthInfo,
  getHealthInfo,
  getHealthInfoById,
  updateHealthInfo,
  deleteHealthInfo,
  getVeterinarians,
} from '../controllers/healthInfo.controller';
import { authenticate, authorize } from '../middleware/auth';


export const healthInfoRouter = Router();

// Public routes
healthInfoRouter.get('/', getHealthInfo);
healthInfoRouter.get('/:id', getHealthInfoById);
healthInfoRouter.get('/vets/search', getVeterinarians);

// Admin only routes
healthInfoRouter.use(authenticate);
healthInfoRouter.post('/', authorize('ADMIN'), createHealthInfo);
healthInfoRouter.put('/:id', authorize('ADMIN'), updateHealthInfo);
healthInfoRouter.delete('/:id', authorize('ADMIN'), deleteHealthInfo);

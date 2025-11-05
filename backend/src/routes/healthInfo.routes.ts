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
import { UserRole } from '../types/prisma';

export const healthInfoRouter = Router();

// Public routes
healthInfoRouter.get('/', getHealthInfo);
healthInfoRouter.get('/:id', getHealthInfoById);
healthInfoRouter.get('/vets/search', getVeterinarians);

// Admin only routes
healthInfoRouter.use(authenticate);
healthInfoRouter.post('/', authorize(UserRole.ADMIN), createHealthInfo);
healthInfoRouter.put('/:id', authorize(UserRole.ADMIN), updateHealthInfo);
healthInfoRouter.delete('/:id', authorize(UserRole.ADMIN), deleteHealthInfo);

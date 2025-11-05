import { Router } from 'express';
import {
  getMatches,
  getMatchById,
  verifyMatch,
  dismissMatch,
} from '../controllers/match.controller';
import { authenticate } from '../middleware/auth';

export const matchRouter = Router();

// All match routes require authentication
matchRouter.use(authenticate);

matchRouter.get('/', getMatches);
matchRouter.get('/:id', getMatchById);
matchRouter.put('/:id/verify', verifyMatch);
matchRouter.put('/:id/dismiss', dismissMatch);

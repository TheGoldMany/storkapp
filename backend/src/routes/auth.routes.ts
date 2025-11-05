import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';

export const authRouter = Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

// Routes
authRouter.post('/register', registerValidation, register);
authRouter.post('/login', loginValidation, login);
authRouter.get('/profile', authenticate, getProfile);
authRouter.put('/profile', authenticate, updateProfile);

import { Router } from 'express';
import { uploadImage, uploadImages } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth';
import { uploadSingle, uploadMultiple } from '../middleware/upload';

export const uploadRouter = Router();

// All upload routes require authentication
uploadRouter.use(authenticate);

// Upload single image
uploadRouter.post('/image', uploadSingle, uploadImage);

// Upload multiple images
uploadRouter.post('/images', uploadMultiple, uploadImages);

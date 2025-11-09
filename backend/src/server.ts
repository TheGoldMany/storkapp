import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { authRouter } from './routes/auth.routes';
import { shelterRouter } from './routes/shelter.routes';
import { animalRouter } from './routes/animal.routes';
import { lostPetRouter } from './routes/lostPet.routes';
import { foundPetRouter } from './routes/foundPet.routes';
import { subscriptionRouter } from './routes/subscription.routes';
import { donationRouter } from './routes/donation.routes';
import { healthInfoRouter } from './routes/healthInfo.routes';
import { matchRouter } from './routes/match.routes';
import { uploadRouter } from './routes/upload.routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { startAutoDeleteReunitedPets } from './services/scheduler.service';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Root endpoint - API information
app.get('/', (_req, res) => {
  res.json({
    name: 'Stork App API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      shelters: '/api/shelters',
      animals: '/api/animals',
      lostPets: '/api/lost-pets',
      foundPets: '/api/found-pets',
      subscriptions: '/api/subscriptions',
      donations: '/api/donations',
      healthInfo: '/api/health-info',
      matches: '/api/matches'
    },
    documentation: 'https://github.com/TheGoldMany/storkapp'
  });
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/shelters', shelterRouter);
app.use('/api/animals', animalRouter);
app.use('/api/lost-pets', lostPetRouter);
app.use('/api/found-pets', foundPetRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/donations', donationRouter);
app.use('/api/health-info', healthInfoRouter);
app.use('/api/matches', matchRouter);
app.use('/api/upload', uploadRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV}`);

  // Start auto-delete scheduler for reunited pets (runs daily at 2 AM)
  startAutoDeleteReunitedPets();
});

export default app;

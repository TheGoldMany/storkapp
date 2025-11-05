import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.routes';
import { shelterRouter } from './routes/shelter.routes';
import { animalRouter } from './routes/animal.routes';
import { lostPetRouter } from './routes/lostPet.routes';
import { foundPetRouter } from './routes/foundPet.routes';
import { subscriptionRouter } from './routes/subscription.routes';
import { donationRouter } from './routes/donation.routes';
import { healthInfoRouter } from './routes/healthInfo.routes';
import { matchRouter } from './routes/match.routes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

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

// Request logging
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
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

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV}`);
});

export default app;

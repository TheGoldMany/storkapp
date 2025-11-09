import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Auto-delete reunited pets after 3 days
 * Runs daily at 2 AM
 */
export const startAutoDeleteReunitedPets = () => {
  // Run every day at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      console.log('[Scheduler] Starting auto-delete of old reunited pets...');

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      // Delete lost pets that were reunited more than 3 days ago
      const deletedLostPets = await prisma.lostPet.deleteMany({
        where: {
          status: 'REUNITED',
          updatedAt: {
            lt: threeDaysAgo,
          },
        },
      });

      // Delete found pets that were reunited more than 3 days ago
      const deletedFoundPets = await prisma.foundPet.deleteMany({
        where: {
          status: 'REUNITED',
          updatedAt: {
            lt: threeDaysAgo,
          },
        },
      });

      console.log(
        `[Scheduler] Auto-deleted ${deletedLostPets.count} lost pets and ${deletedFoundPets.count} found pets`
      );
    } catch (error) {
      console.error('[Scheduler] Error auto-deleting reunited pets:', error);
    }
  });

  console.log('[Scheduler] Auto-delete scheduler started (runs daily at 2 AM)');
};

/**
 * Delete reunited pets immediately (manual trigger)
 */
export const deleteOldReunitedPets = async () => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const [deletedLostPets, deletedFoundPets] = await Promise.all([
    prisma.lostPet.deleteMany({
      where: {
        status: 'REUNITED',
        updatedAt: {
          lt: threeDaysAgo,
        },
      },
    }),
    prisma.foundPet.deleteMany({
      where: {
        status: 'REUNITED',
        updatedAt: {
          lt: threeDaysAgo,
        },
      },
    }),
  ]);

  return {
    deletedLostPets: deletedLostPets.count,
    deletedFoundPets: deletedFoundPets.count,
  };
};

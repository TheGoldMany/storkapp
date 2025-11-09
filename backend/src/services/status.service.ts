import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Statuses that trigger auto-deletion after 3 days
const AUTO_DELETE_ANIMAL_STATUSES = ['ADOPTED'];
const AUTO_DELETE_PET_STATUSES = ['REUNITED'];

class StatusService {
  /**
   * Calculate deletion scheduled date (3 days from now)
   */
  private getDeletionDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date;
  }

  /**
   * Handle animal status change
   * Set deletionScheduledAt if status is ADOPTED
   * Clear deletionScheduledAt if status changes back
   */
  handleAnimalStatusChange(
    oldStatus: string | null,
    newStatus: string
  ): { deletionScheduledAt: Date | null } {
    // If changing to ADOPTED, schedule deletion
    if (AUTO_DELETE_ANIMAL_STATUSES.includes(newStatus)) {
      return { deletionScheduledAt: this.getDeletionDate() };
    }

    // If changing from ADOPTED to something else, cancel deletion
    if (oldStatus && AUTO_DELETE_ANIMAL_STATUSES.includes(oldStatus)) {
      return { deletionScheduledAt: null };
    }

    // No change needed
    return { deletionScheduledAt: null };
  }

  /**
   * Handle pet (lost/found) status change
   * Set deletionScheduledAt if status is REUNITED
   * Clear deletionScheduledAt if status changes back
   */
  handlePetStatusChange(
    oldStatus: string | null,
    newStatus: string
  ): { deletionScheduledAt: Date | null } {
    // If changing to REUNITED, schedule deletion
    if (AUTO_DELETE_PET_STATUSES.includes(newStatus)) {
      return { deletionScheduledAt: this.getDeletionDate() };
    }

    // If changing from REUNITED to something else, cancel deletion
    if (oldStatus && AUTO_DELETE_PET_STATUSES.includes(oldStatus)) {
      return { deletionScheduledAt: null };
    }

    // No change needed
    return { deletionScheduledAt: null };
  }

  /**
   * Delete all records that have passed their deletion date
   */
  async deleteExpiredRecords() {
    const now = new Date();

    try {
      // Delete expired animals
      const deletedAnimals = await prisma.animal.deleteMany({
        where: {
          deletionScheduledAt: {
            lte: now,
          },
        },
      });

      // Delete expired lost pets
      const deletedLostPets = await prisma.lostPet.deleteMany({
        where: {
          deletionScheduledAt: {
            lte: now,
          },
        },
      });

      // Delete expired found pets
      const deletedFoundPets = await prisma.foundPet.deleteMany({
        where: {
          deletionScheduledAt: {
            lte: now,
          },
        },
      });

      console.log(
        `Auto-deletion completed: ${deletedAnimals.count} animals, ${deletedLostPets.count} lost pets, ${deletedFoundPets.count} found pets`
      );

      return {
        animals: deletedAnimals.count,
        lostPets: deletedLostPets.count,
        foundPets: deletedFoundPets.count,
      };
    } catch (error) {
      console.error('Auto-deletion error:', error);
      throw error;
    }
  }
}

export const statusService = new StatusService();

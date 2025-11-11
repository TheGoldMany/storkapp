import { PrismaClient } from '@prisma/client';
import { deleteImageFiles } from '../utils/fileCleanup';

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
      // Find and delete expired animals with their images
      const expiredAnimals = await prisma.animal.findMany({
        where: {
          deletionScheduledAt: {
            lte: now,
          },
        },
        select: {
          id: true,
          images: true,
        },
      });

      for (const animal of expiredAnimals) {
        if (animal.images && animal.images.length > 0) {
          deleteImageFiles(animal.images);
        }
        await prisma.animal.delete({ where: { id: animal.id } });
      }

      // Find and delete expired lost pets with their images
      const expiredLostPets = await prisma.lostPet.findMany({
        where: {
          deletionScheduledAt: {
            lte: now,
          },
        },
        select: {
          id: true,
          images: true,
        },
      });

      for (const lostPet of expiredLostPets) {
        if (lostPet.images && lostPet.images.length > 0) {
          deleteImageFiles(lostPet.images);
        }
        await prisma.lostPet.delete({ where: { id: lostPet.id } });
      }

      // Find and delete expired found pets with their images
      const expiredFoundPets = await prisma.foundPet.findMany({
        where: {
          deletionScheduledAt: {
            lte: now,
          },
        },
        select: {
          id: true,
          images: true,
        },
      });

      for (const foundPet of expiredFoundPets) {
        if (foundPet.images && foundPet.images.length > 0) {
          deleteImageFiles(foundPet.images);
        }
        await prisma.foundPet.delete({ where: { id: foundPet.id } });
      }

      const totalDeleted = {
        animals: expiredAnimals.length,
        lostPets: expiredLostPets.length,
        foundPets: expiredFoundPets.length,
      };

      console.log(
        `Auto-deletion completed: ${totalDeleted.animals} animals, ${totalDeleted.lostPets} lost pets, ${totalDeleted.foundPets} found pets`
      );

      return totalDeleted;
    } catch (error) {
      console.error('Auto-deletion error:', error);
      throw error;
    }
  }
}

export const statusService = new StatusService();

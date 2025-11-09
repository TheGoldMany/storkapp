-- Add STRAY status to AnimalStatus enum
ALTER TYPE "AnimalStatus" ADD VALUE IF NOT EXISTS 'STRAY';

-- Add deletionScheduledAt column to animals table for auto-deletion feature
ALTER TABLE "animals" ADD COLUMN IF NOT EXISTS "deletionScheduledAt" TIMESTAMP(3);

-- Add deletionScheduledAt column to lost_pets table for auto-deletion feature
ALTER TABLE "lost_pets" ADD COLUMN IF NOT EXISTS "deletionScheduledAt" TIMESTAMP(3);

-- Add deletionScheduledAt column to found_pets table for auto-deletion feature
ALTER TABLE "found_pets" ADD COLUMN IF NOT EXISTS "deletionScheduledAt" TIMESTAMP(3);

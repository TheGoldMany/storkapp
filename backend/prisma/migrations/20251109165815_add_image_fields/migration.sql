-- Add ageUnit and specialNeeds fields to Animal table
ALTER TABLE "animals" ADD COLUMN IF NOT EXISTS "ageUnit" TEXT;
ALTER TABLE "animals" ADD COLUMN IF NOT EXISTS "specialNeeds" TEXT;

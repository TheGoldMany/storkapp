#!/usr/bin/env ts-node

/**
 * Cleanup Orphaned Images Script
 *
 * This script finds and deletes image files that are no longer referenced
 * in the database (orphaned files). This can happen if:
 * - A record was deleted manually from the database
 * - An error occurred during deletion
 * - Development/testing left test files
 *
 * Run this script periodically (e.g., weekly) to free up disk space.
 *
 * Usage:
 *   ts-node src/scripts/cleanupOrphanedImages.ts
 *   or
 *   npm run cleanup:images
 */

import { PrismaClient } from '@prisma/client';
import { cleanupOrphanedImages } from '../utils/fileCleanup';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting orphaned images cleanup...');
  console.log('This may take a few minutes depending on the number of files.\n');

  try {
    const deletedCount = await cleanupOrphanedImages(prisma);

    if (deletedCount === 0) {
      console.log('✓ No orphaned images found. All files are properly referenced.');
    } else {
      console.log(`✓ Successfully cleaned up ${deletedCount} orphaned image(s)`);
      console.log(`  Freed disk space: ~${(deletedCount * 2).toFixed(1)} MB (estimated)\n`);
    }
  } catch (error) {
    console.error('✗ Error during cleanup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  console.log('Cleanup completed!');
}

main();

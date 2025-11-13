#!/usr/bin/env ts-node

/**
 * Geocode Existing Records Script
 *
 * This script geocodes all existing shelters, lost pets, and found pets
 * that don't have latitude/longitude coordinates yet.
 *
 * This is useful for:
 * - Migrating existing data after implementing geocoding
 * - Fixing records that failed to geocode during creation
 * - Populating the map with existing data
 *
 * Usage:
 *   ts-node src/scripts/geocodeExistingRecords.ts
 *   or
 *   npm run geocode:existing
 */

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { PrismaClient } from '@prisma/client';
import { geocodingService } from '../services/geocoding.service';

const prisma = new PrismaClient();

async function geocodeShelters() {
  console.log('\n📍 Geocoding shelters...');

  const shelters = await prisma.shelter.findMany({
    where: {
      OR: [
        { latitude: null },
        { longitude: null },
      ],
    },
  });

  console.log(`Found ${shelters.length} shelters without coordinates`);

  let successCount = 0;
  let failCount = 0;

  for (const shelter of shelters) {
    try {
      const coords = await geocodingService.geocodeAddress(
        shelter.address,
        shelter.city,
        shelter.country
      );

      if (coords) {
        await prisma.shelter.update({
          where: { id: shelter.id },
          data: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        });
        console.log(`  ✓ ${shelter.name} (${shelter.city})`);
        successCount++;
      } else {
        console.log(`  ✗ Failed: ${shelter.name} (${shelter.city})`);
        failCount++;
      }

      // Respectful delay to avoid overwhelming the geocoding service
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  ✗ Error geocoding ${shelter.name}:`, error);
      failCount++;
    }
  }

  console.log(`Shelters: ${successCount} succeeded, ${failCount} failed`);
  return { successCount, failCount };
}

async function geocodeLostPets() {
  console.log('\n📍 Geocoding lost pets...');

  const lostPets = await prisma.lostPet.findMany({
    where: {
      OR: [
        { latitude: null },
        { longitude: null },
      ],
    },
  });

  console.log(`Found ${lostPets.length} lost pets without coordinates`);

  let successCount = 0;
  let failCount = 0;

  for (const pet of lostPets) {
    try {
      const coords = await geocodingService.geocodeAddress(
        pet.lastSeenLocation || '',
        pet.lastSeenCity,
        'Hungary'
      );

      if (coords) {
        await prisma.lostPet.update({
          where: { id: pet.id },
          data: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        });
        console.log(`  ✓ ${pet.name || 'Unknown'} (${pet.lastSeenCity})`);
        successCount++;
      } else {
        console.log(`  ✗ Failed: ${pet.name || 'Unknown'} (${pet.lastSeenCity})`);
        failCount++;
      }

      // Respectful delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  ✗ Error geocoding lost pet ${pet.id}:`, error);
      failCount++;
    }
  }

  console.log(`Lost pets: ${successCount} succeeded, ${failCount} failed`);
  return { successCount, failCount };
}

async function geocodeFoundPets() {
  console.log('\n📍 Geocoding found pets...');

  const foundPets = await prisma.foundPet.findMany({
    where: {
      OR: [
        { latitude: null },
        { longitude: null },
      ],
    },
  });

  console.log(`Found ${foundPets.length} found pets without coordinates`);

  let successCount = 0;
  let failCount = 0;

  for (const pet of foundPets) {
    try {
      const coords = await geocodingService.geocodeAddress(
        pet.foundLocation || '',
        pet.foundCity,
        'Hungary'
      );

      if (coords) {
        await prisma.foundPet.update({
          where: { id: pet.id },
          data: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        });
        console.log(`  ✓ Found ${pet.type} (${pet.foundCity})`);
        successCount++;
      } else {
        console.log(`  ✗ Failed: Found ${pet.type} (${pet.foundCity})`);
        failCount++;
      }

      // Respectful delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  ✗ Error geocoding found pet ${pet.id}:`, error);
      failCount++;
    }
  }

  console.log(`Found pets: ${successCount} succeeded, ${failCount} failed`);
  return { successCount, failCount };
}

async function main() {
  console.log('🗺️  Starting geocoding of existing records...');
  console.log('This may take several minutes depending on the number of records.\n');
  console.log('NOTE: This script uses OpenStreetMap Nominatim service.');
  console.log('Please be respectful and don\'t run this too frequently.\n');

  try {
    const shelterResults = await geocodeShelters();
    const lostPetResults = await geocodeLostPets();
    const foundPetResults = await geocodeFoundPets();

    const totalSuccess = shelterResults.successCount + lostPetResults.successCount + foundPetResults.successCount;
    const totalFailed = shelterResults.failCount + lostPetResults.failCount + foundPetResults.failCount;

    console.log('\n✅ Geocoding completed!');
    console.log(`📊 Summary: ${totalSuccess} succeeded, ${totalFailed} failed`);

    if (totalSuccess > 0) {
      console.log('\n💡 Tip: Reload the map page to see the newly geocoded markers!');
    }

    if (totalFailed > 0) {
      console.log('\n⚠️  Some records failed to geocode. This might be due to:');
      console.log('   - Invalid or incomplete addresses');
      console.log('   - Geocoding service temporarily unavailable');
      console.log('   - Rate limiting from the geocoding service');
      console.log('\n   You can run this script again later to retry failed records.');
    }
  } catch (error) {
    console.error('❌ Error during geocoding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

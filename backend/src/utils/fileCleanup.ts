import fs from 'fs';
import path from 'path';

/**
 * Delete image files from the filesystem
 * @param imageUrls - Array of image URLs (e.g., ['/uploads/image1.jpg', '/uploads/image2.jpg'])
 */
export const deleteImageFiles = (imageUrls: string[]): void => {
  if (!imageUrls || imageUrls.length === 0) {
    return;
  }

  imageUrls.forEach((url) => {
    try {
      // Extract filename from URL (e.g., '/uploads/image.jpg' -> 'image.jpg')
      const filename = path.basename(url);
      const uploadsDir = path.join(__dirname, '../../uploads');
      const filePath = path.join(uploadsDir, filename);

      // Check if file exists and delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted image file: ${filename}`);
      }
    } catch (error) {
      console.error(`Failed to delete image file: ${url}`, error);
      // Continue with other files even if one fails
    }
  });
};

/**
 * Clean up orphaned image files that are no longer referenced in the database
 * This function should be run periodically (e.g., daily via cron job)
 */
export const cleanupOrphanedImages = async (prisma: any): Promise<number> => {
  const uploadsDir = path.join(__dirname, '../../uploads');

  if (!fs.existsSync(uploadsDir)) {
    return 0;
  }

  const files = fs.readdirSync(uploadsDir);
  let deletedCount = 0;

  for (const file of files) {
    const imageUrl = `/uploads/${file}`;

    // Check if image is referenced in any of the tables
    const [animalCount, lostPetCount, foundPetCount] = await Promise.all([
      prisma.animal.count({
        where: {
          images: {
            has: imageUrl,
          },
        },
      }),
      prisma.lostPet.count({
        where: {
          images: {
            has: imageUrl,
          },
        },
      }),
      prisma.foundPet.count({
        where: {
          images: {
            has: imageUrl,
          },
        },
      }),
    ]);

    // If image is not referenced anywhere, delete it
    if (animalCount === 0 && lostPetCount === 0 && foundPetCount === 0) {
      try {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
        deletedCount++;
        console.log(`Cleaned up orphaned image: ${file}`);
      } catch (error) {
        console.error(`Failed to delete orphaned image: ${file}`, error);
      }
    }
  }

  return deletedCount;
};

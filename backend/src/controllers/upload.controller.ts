import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../middleware/errorHandler';

// Upload single image
export const uploadImage = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  // Return the file URL
  const fileUrl = `/uploads/${req.file.filename}`;

  res.json({
    status: 'success',
    data: {
      url: fileUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
  });
});

// Upload multiple images
export const uploadImages = asyncHandler(async (req: AuthRequest, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new AppError('No files uploaded', 400);
  }

  // Return array of file URLs
  const fileUrls = files.map((file) => ({
    url: `/uploads/${file.filename}`,
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
  }));

  res.json({
    status: 'success',
    data: {
      files: fileUrls,
    },
  });
});

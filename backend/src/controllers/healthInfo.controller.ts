import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError, asyncHandler } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Type alias
type AnimalType = 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'OTHER';

export const createHealthInfo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { animalType, category, title, content, tags } = req.body;

  const healthInfo = await prisma.healthInfo.create({
    data: {
      animalType: animalType as AnimalType,
      category,
      title,
      content,
      tags: tags || [],
    },
  });

  res.status(201).json({
    status: 'success',
    data: { healthInfo },
  });
});

export const getHealthInfo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { animalType, category, search, page = 1, limit = 20 } = req.query;

  const where: any = {};

  if (animalType) {
    where.animalType = animalType as AnimalType;
  }

  if (category) {
    where.category = category as string;
  }

  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { content: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [healthInfo, total] = await Promise.all([
    prisma.healthInfo.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.healthInfo.count({ where }),
  ]);

  res.json({
    status: 'success',
    data: {
      healthInfo,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getHealthInfoById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const healthInfo = await prisma.healthInfo.findUnique({
    where: { id },
  });

  if (!healthInfo) {
    throw new AppError('Health information not found', 404);
  }

  res.json({
    status: 'success',
    data: { healthInfo },
  });
});

export const updateHealthInfo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const healthInfo = await prisma.healthInfo.update({
    where: { id },
    data: req.body,
  });

  res.json({
    status: 'success',
    data: { healthInfo },
  });
});

export const deleteHealthInfo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await prisma.healthInfo.delete({ where: { id } });

  res.json({
    status: 'success',
    message: 'Health information deleted successfully',
  });
});

export const getVeterinarians = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { city, specialization, page = 1, limit = 20 } = req.query;

  const where: any = { active: true };

  if (city) {
    where.city = { contains: city as string, mode: 'insensitive' };
  }

  if (specialization) {
    where.specialization = { has: specialization as string };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [vets, total] = await Promise.all([
    prisma.veterinarian.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { rating: 'desc' },
    }),
    prisma.veterinarian.count({ where }),
  ]);

  res.json({
    status: 'success',
    data: {
      veterinarians: vets,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

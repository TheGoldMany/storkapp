import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import axios from 'axios';

const prisma = new PrismaClient();

// Type alias
type AnimalType = 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'OTHER';

export const createLostPet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    name,
    type,
    breed,
    age,
    gender,
    size,
    color,
    description,
    images,
    lastSeenLocation,
    lastSeenCity,
    lastSeenDate,
    latitude,
    longitude,
    contactName,
    contactPhone,
    contactEmail,
    reward,
  } = req.body;

  const lostPet = await prisma.lostPet.create({
    data: {
      name,
      type: type as AnimalType,
      breed,
      age,
      gender,
      size,
      color,
      description,
      images: images || [],
      lastSeenLocation,
      lastSeenCity,
      lastSeenDate: new Date(lastSeenDate),
      latitude,
      longitude,
      contactName,
      contactPhone,
      contactEmail,
      reward,
      userId: req.user!.id,
    },
  });

  // Trigger AI matching in background
  if (images && images.length > 0) {
    try {
      await axios.post(`${process.env.AI_SERVICE_URL}/api/match/lost-pet`, {
        lostPetId: lostPet.id,
        images,
        type,
        city: lastSeenCity,
      });
    } catch (error) {
      console.error('AI matching failed:', error);
      // Don't fail the request if AI service is down
    }
  }

  res.status(201).json({
    status: 'success',
    data: { lostPet },
  });
});

export const getLostPets = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, city, status, page = 1, limit = 20 } = req.query;

  const where: any = {};

  if (type) {
    where.type = type as AnimalType;
  }

  if (city) {
    where.lastSeenCity = { contains: city as string, mode: 'insensitive' };
  }

  if (status) {
    where.status = status;
  } else {
    where.status = 'LOST'; // Default to active lost pets
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [lostPets, total] = await Promise.all([
    prisma.lostPet.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.lostPet.count({ where }),
  ]);

  res.json({
    status: 'success',
    data: {
      lostPets,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getLostPetById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const lostPet = await prisma.lostPet.findUnique({
    where: { id },
    include: {
      matches: {
        where: { dismissed: false },
        include: {
          foundPet: true,
          animal: {
            include: { shelter: true },
          },
        },
        orderBy: { confidence: 'desc' },
      },
    },
  });

  if (!lostPet) {
    throw new AppError('Lost pet not found', 404);
  }

  res.json({
    status: 'success',
    data: lostPet,
  });
});

export const getMyLostPets = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lostPets = await prisma.lostPet.findMany({
    where: { userId: req.user!.id },
    include: {
      matches: {
        where: { dismissed: false },
        orderBy: { confidence: 'desc' },
        take: 5,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    status: 'success',
    data: { lostPets },
  });
});

export const updateLostPet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const lostPet = await prisma.lostPet.findUnique({ where: { id } });
  if (!lostPet) {
    throw new AppError('Lost pet not found', 404);
  }

  if (lostPet.userId !== req.user!.id) {
    throw new AppError('Unauthorized', 403);
  }

  const updatedLostPet = await prisma.lostPet.update({
    where: { id },
    data: req.body,
  });

  res.json({
    status: 'success',
    data: { lostPet: updatedLostPet },
  });
});

export const deleteLostPet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const lostPet = await prisma.lostPet.findUnique({ where: { id } });
  if (!lostPet) {
    throw new AppError('Lost pet not found', 404);
  }

  if (lostPet.userId !== req.user!.id) {
    throw new AppError('Unauthorized', 403);
  }

  await prisma.lostPet.delete({ where: { id } });

  res.json({
    status: 'success',
    message: 'Lost pet deleted successfully',
  });
});

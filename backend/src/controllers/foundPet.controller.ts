import { Response } from 'express';
import { PrismaClient, AnimalType } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import axios from 'axios';

const prisma = new PrismaClient();

export const createFoundPet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    type,
    breed,
    age,
    gender,
    size,
    color,
    description,
    images,
    foundLocation,
    foundCity,
    foundDate,
    latitude,
    longitude,
    finderName,
    finderPhone,
    finderEmail,
    currentLocation,
  } = req.body;

  const foundPet = await prisma.foundPet.create({
    data: {
      type: type as AnimalType,
      breed,
      age,
      gender,
      size,
      color,
      description,
      images: images || [],
      foundLocation,
      foundCity,
      foundDate: new Date(foundDate),
      latitude,
      longitude,
      finderName,
      finderPhone,
      finderEmail,
      currentLocation,
      userId: req.user!.id,
    },
  });

  // Trigger AI matching in background
  if (images && images.length > 0) {
    try {
      await axios.post(`${process.env.AI_SERVICE_URL}/api/match/found-pet`, {
        foundPetId: foundPet.id,
        images,
        type,
        city: foundCity,
      });
    } catch (error) {
      console.error('AI matching failed:', error);
    }
  }

  res.status(201).json({
    status: 'success',
    data: { foundPet },
  });
});

export const getFoundPets = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, city, status, page = 1, limit = 20 } = req.query;

  const where: any = {};

  if (type) {
    where.type = type as AnimalType;
  }

  if (city) {
    where.foundCity = { contains: city as string, mode: 'insensitive' };
  }

  if (status) {
    where.status = status;
  } else {
    where.status = 'FOUND';
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [foundPets, total] = await Promise.all([
    prisma.foundPet.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.foundPet.count({ where }),
  ]);

  res.json({
    status: 'success',
    data: {
      foundPets,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getFoundPetById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const foundPet = await prisma.foundPet.findUnique({
    where: { id },
    include: {
      matches: {
        where: { dismissed: false },
        include: {
          lostPet: true,
        },
        orderBy: { confidence: 'desc' },
      },
    },
  });

  if (!foundPet) {
    throw new AppError('Found pet not found', 404);
  }

  res.json({
    status: 'success',
    data: { foundPet },
  });
});

export const updateFoundPet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const foundPet = await prisma.foundPet.findUnique({ where: { id } });
  if (!foundPet) {
    throw new AppError('Found pet not found', 404);
  }

  if (foundPet.userId !== req.user!.id) {
    throw new AppError('Unauthorized', 403);
  }

  const updatedFoundPet = await prisma.foundPet.update({
    where: { id },
    data: req.body,
  });

  res.json({
    status: 'success',
    data: { foundPet: updatedFoundPet },
  });
});

export const deleteFoundPet = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const foundPet = await prisma.foundPet.findUnique({ where: { id } });
  if (!foundPet) {
    throw new AppError('Found pet not found', 404);
  }

  if (foundPet.userId !== req.user!.id) {
    throw new AppError('Unauthorized', 403);
  }

  await prisma.foundPet.delete({ where: { id } });

  res.json({
    status: 'success',
    message: 'Found pet deleted successfully',
  });
});

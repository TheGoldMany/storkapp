import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AnimalType, AnimalStatus } from '../types/prisma';
import { AuthRequest } from '../middleware/auth';
import { AppError, asyncHandler } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const createAnimal = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Get user's shelter
  const shelter = await prisma.shelter.findUnique({
    where: { userId: req.user!.id },
  });

  if (!shelter) {
    throw new AppError('Shelter not found', 404);
  }

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
    vaccinated,
    neutered,
    microchipped,
    healthIssues,
  } = req.body;

  const animal = await prisma.animal.create({
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
      vaccinated: vaccinated || false,
      neutered: neutered || false,
      microchipped: microchipped || false,
      healthIssues,
      shelterId: shelter.id,
    },
  });

  res.status(201).json({
    status: 'success',
    data: { animal },
  });
});

export const getAnimals = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    shelterId,
    type,
    status,
    city,
    page = 1,
    limit = 20,
  } = req.query;

  const where: any = {};

  if (shelterId) {
    where.shelterId = shelterId as string;
  }

  if (type) {
    where.type = type as AnimalType;
  }

  if (status) {
    where.status = status as AnimalStatus;
  } else {
    where.status = 'AVAILABLE'; // Default to available
  }

  if (city) {
    where.shelter = {
      city: { contains: city as string, mode: 'insensitive' },
    };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [animals, total] = await Promise.all([
    prisma.animal.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        shelter: {
          select: {
            id: true,
            name: true,
            city: true,
            verified: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.animal.count({ where }),
  ]);

  res.json({
    status: 'success',
    data: {
      animals,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getAnimalById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const animal = await prisma.animal.findUnique({
    where: { id },
    include: {
      shelter: true,
    },
  });

  if (!animal) {
    throw new AppError('Animal not found', 404);
  }

  res.json({
    status: 'success',
    data: { animal },
  });
});

export const updateAnimal = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Check if animal belongs to user's shelter
  const animal = await prisma.animal.findUnique({
    where: { id },
    include: { shelter: true },
  });

  if (!animal) {
    throw new AppError('Animal not found', 404);
  }

  if (animal.shelter.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
    throw new AppError('Unauthorized', 403);
  }

  const updatedAnimal = await prisma.animal.update({
    where: { id },
    data: req.body,
  });

  res.json({
    status: 'success',
    data: { animal: updatedAnimal },
  });
});

export const deleteAnimal = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const animal = await prisma.animal.findUnique({
    where: { id },
    include: { shelter: true },
  });

  if (!animal) {
    throw new AppError('Animal not found', 404);
  }

  if (animal.shelter.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
    throw new AppError('Unauthorized', 403);
  }

  await prisma.animal.delete({ where: { id } });

  res.json({
    status: 'success',
    message: 'Animal deleted successfully',
  });
});

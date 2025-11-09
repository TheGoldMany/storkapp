import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError, asyncHandler } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const createShelter = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    name,
    description,
    email,
    phone,
    address,
    city,
    country,
    postalCode,
    latitude,
    longitude,
    website,
    logo,
    images,
    bankAccount,
    taxNumber,
  } = req.body;

  // Check if user already has a shelter
  const existingShelter = await prisma.shelter.findUnique({
    where: { userId: req.user!.id },
  });

  if (existingShelter) {
    throw new AppError('User already has a shelter', 400);
  }

  const shelter = await prisma.shelter.create({
    data: {
      name,
      description,
      email,
      phone,
      address,
      city,
      country: country || 'Hungary',
      postalCode,
      latitude,
      longitude,
      website,
      logo,
      images: images || [],
      bankAccount,
      taxNumber,
      userId: req.user!.id,
    },
  });

  // Update user role to SHELTER_ADMIN
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { role: 'SHELTER_ADMIN' },
  });

  res.status(201).json({
    status: 'success',
    data: { shelter },
  });
});

export const getShelters = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { city, verified, page = 1, limit = 10 } = req.query;

  const where: any = { active: true };

  if (city) {
    where.city = { contains: city as string, mode: 'insensitive' };
  }

  if (verified !== undefined) {
    where.verified = verified === 'true';
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [shelters, total] = await Promise.all([
    prisma.shelter.findMany({
      where,
      skip,
      take: Number(limit),
      include: {
        _count: {
          select: { animals: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.shelter.count({ where }),
  ]);

  res.json({
    status: 'success',
    data: {
      shelters,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getShelterById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const shelter = await prisma.shelter.findUnique({
    where: { id },
    include: {
      animals: {
        where: { status: 'AVAILABLE' },
        take: 10,
      },
      _count: {
        select: { animals: true },
      },
    },
  });

  if (!shelter) {
    throw new AppError('Shelter not found', 404);
  }

  res.json({
    status: 'success',
    data: shelter,
  });
});

export const getMyShelter = asyncHandler(async (req: AuthRequest, res: Response) => {
  const shelter = await prisma.shelter.findUnique({
    where: { userId: req.user!.id },
    include: {
      animals: true,
      subscriptions: {
        where: { status: 'ACTIVE' },
      },
      _count: {
        select: {
          animals: true,
          donations: true,
        },
      },
    },
  });

  if (!shelter) {
    throw new AppError('Shelter not found', 404);
  }

  res.json({
    status: 'success',
    data: shelter,
  });
});

export const updateShelter = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Check ownership
  const shelter = await prisma.shelter.findUnique({ where: { id } });
  if (!shelter) {
    throw new AppError('Shelter not found', 404);
  }

  if (shelter.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
    throw new AppError('Unauthorized', 403);
  }

  const updatedShelter = await prisma.shelter.update({
    where: { id },
    data: req.body,
  });

  res.json({
    status: 'success',
    data: { shelter: updatedShelter },
  });
});

export const deleteShelter = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const shelter = await prisma.shelter.findUnique({ where: { id } });
  if (!shelter) {
    throw new AppError('Shelter not found', 404);
  }

  if (shelter.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
    throw new AppError('Unauthorized', 403);
  }

  await prisma.shelter.delete({ where: { id } });

  res.json({
    status: 'success',
    message: 'Shelter deleted successfully',
  });
});

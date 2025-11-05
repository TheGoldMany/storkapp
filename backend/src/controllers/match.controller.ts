import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError, asyncHandler } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export const getMatches = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { lostPetId, foundPetId, minConfidence = 50 } = req.query;

  const where: any = {
    dismissed: false,
    confidence: { gte: Number(minConfidence) },
  };

  if (lostPetId) {
    where.lostPetId = lostPetId as string;
  }

  if (foundPetId) {
    where.foundPetId = foundPetId as string;
  }

  const matches = await prisma.match.findMany({
    where,
    include: {
      lostPet: true,
      foundPet: true,
      animal: {
        include: { shelter: true },
      },
    },
    orderBy: { confidence: 'desc' },
  });

  res.json({
    status: 'success',
    data: { matches },
  });
});

export const getMatchById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      lostPet: true,
      foundPet: true,
      animal: {
        include: { shelter: true },
      },
    },
  });

  if (!match) {
    throw new AppError('Match not found', 404);
  }

  res.json({
    status: 'success',
    data: { match },
  });
});

export const verifyMatch = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;

  const match = await prisma.match.findUnique({
    where: { id },
    include: { lostPet: true },
  });

  if (!match) {
    throw new AppError('Match not found', 404);
  }

  // Check if user owns the lost pet
  if (match.lostPet && match.lostPet.userId !== req.user!.id) {
    throw new AppError('Unauthorized', 403);
  }

  const updatedMatch = await prisma.match.update({
    where: { id },
    data: {
      verified: true,
      notes,
    },
  });

  // Update lost pet status to REUNITED
  if (match.lostPetId) {
    await prisma.lostPet.update({
      where: { id: match.lostPetId },
      data: { status: 'REUNITED' },
    });
  }

  res.json({
    status: 'success',
    data: { match: updatedMatch },
  });
});

export const dismissMatch = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const match = await prisma.match.findUnique({
    where: { id },
    include: { lostPet: true },
  });

  if (!match) {
    throw new AppError('Match not found', 404);
  }

  if (match.lostPet && match.lostPet.userId !== req.user!.id) {
    throw new AppError('Unauthorized', 403);
  }

  const updatedMatch = await prisma.match.update({
    where: { id },
    data: { dismissed: true },
  });

  res.json({
    status: 'success',
    data: { match: updatedMatch },
  });
});

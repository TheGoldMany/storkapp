import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { emailService } from '../services/email.service';

const prisma = new PrismaClient();

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { email, password, firstName, lastName, phone, role, shelter } = req.body;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user (and shelter if role is SHELTER_ADMIN)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: role || 'USER',
      verificationToken,
      verificationTokenExpires,
      // Create shelter if registering as shelter admin
      ...(role === 'SHELTER_ADMIN' && shelter && {
        shelter: {
          create: {
            name: shelter.name,
            description: shelter.description || null,
            email: shelter.email || email,
            phone: shelter.phone || phone || '',
            address: shelter.address,
            city: shelter.city,
            country: shelter.country || 'Hungary',
            postalCode: shelter.postalCode || null,
          },
        },
      }),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      verified: true,
      shelter: true,
    },
  });

  // Send verification email (don't wait for it, send async)
  emailService.sendVerificationEmail(email, firstName, verificationToken).catch((err) => {
    console.error('Failed to send verification email:', err);
  });

  // Generate token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string
  );

  res.status(201).json({
    status: 'success',
    data: { user, token },
    message: 'Registration successful. Please check your email to verify your account.',
  });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string
  );

  res.json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    },
  });
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      avatar: true,
      verified: true,
      createdAt: true,
      shelter: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    status: 'success',
    data: { user },
  });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, phone, avatar, shelter } = req.body;

  // Update user data
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone && { phone }),
      ...(avatar !== undefined && { avatar }),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      avatar: true,
      shelter: true,
    },
  });

  // Update shelter data if user is shelter admin and shelter data provided
  if (user.role === 'SHELTER_ADMIN' && shelter && user.shelter) {
    await prisma.shelter.update({
      where: { id: user.shelter.id },
      data: {
        ...(shelter.name && { name: shelter.name }),
        ...(shelter.description !== undefined && { description: shelter.description }),
        ...(shelter.address && { address: shelter.address }),
        ...(shelter.city && { city: shelter.city }),
        ...(shelter.phone && { phone: shelter.phone }),
        ...(shelter.email && { email: shelter.email }),
        ...(shelter.logo !== undefined && { logo: shelter.logo }),
        ...(shelter.website !== undefined && { website: shelter.website }),
      },
    });

    // Fetch updated user with shelter
    const updatedUser = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatar: true,
        shelter: true,
      },
    });

    return res.json({
      status: 'success',
      data: { user: updatedUser },
    });
  }

  res.json({
    status: 'success',
    data: { user },
  });
});

export const verifyEmail = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('Verification token is required', 400);
  }

  // Find user with this token
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationTokenExpires: {
        gt: new Date(), // Token must not be expired
      },
    },
  });

  if (!user) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  // Update user as verified and clear token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      verified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    },
  });

  res.json({
    status: 'success',
    message: 'Email verified successfully!',
  });
});

export const resendVerification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.verified) {
    throw new AppError('Email is already verified', 400);
  }

  // Generate new verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Update user with new token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken,
      verificationTokenExpires,
    },
  });

  // Send verification email
  await emailService.sendVerificationEmail(email, user.firstName, verificationToken);

  res.json({
    status: 'success',
    message: 'Verification email sent. Please check your inbox.',
  });
});

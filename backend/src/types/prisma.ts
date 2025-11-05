// Temporary type definitions until Prisma client is generated
// These should match the enums in prisma/schema.prisma

export enum UserRole {
  USER = 'USER',
  SHELTER_ADMIN = 'SHELTER_ADMIN',
  VET = 'VET',
  ADMIN = 'ADMIN',
}

export enum AnimalType {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  RABBIT = 'RABBIT',
  OTHER = 'OTHER',
}

export enum AnimalStatus {
  AVAILABLE = 'AVAILABLE',
  ADOPTED = 'ADOPTED',
  RESERVED = 'RESERVED',
  MEDICAL_CARE = 'MEDICAL_CARE',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export enum PetStatus {
  LOST = 'LOST',
  FOUND = 'FOUND',
  REUNITED = 'REUNITED',
  CLOSED = 'CLOSED',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  PAST_DUE = 'PAST_DUE',
  EXPIRED = 'EXPIRED',
}

export enum SubscriptionTier {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  SUPPORTER = 'SUPPORTER',
}

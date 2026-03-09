// Enums matching Prisma schema for runtime use
// These must match the enums defined in prisma/schema/*.prisma files
// Note: Clinical exam categoricals (BodyType, ObesityType, etc.) and AnimalSex
// have been converted to DB lookup tables with numericValue for AI model input.

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  VETERINARIAN = 'VETERINARIAN',
  FARMER = 'FARMER',
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum ProphylaxisType {
  VACCINE = 'VACCINE',
  IMMUNIZATION = 'IMMUNIZATION',
  DEWORMING = 'DEWORMING',
}

export enum UrineAnalysisType {
  LABORATORY = 'LABORATORY',
  MACROSCOPIC = 'MACROSCOPIC',
  MICROSCOPIC = 'MICROSCOPIC',
}

export enum FecesAnalysisType {
  MACROSCOPIC = 'MACROSCOPIC',
  MICROSCOPIC = 'MICROSCOPIC',
}

// Enums matching Prisma schema for runtime use
// These must match the enums defined in prisma/schema/*.prisma files

export enum AnimalSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NEUTERED = 'NEUTERED',
  SPAYED = 'SPAYED',
  UNKNOWN = 'UNKNOWN',
}

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
  TREATMENT = 'TREATMENT',
}

export enum BodyType {
  STRONG = 'STRONG',
  MEDIUM = 'MEDIUM',
  WEAK = 'WEAK',
}

export enum ObesityType {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  CACHEXIA = 'CACHEXIA',
}

export enum BodyPosition {
  NATURAL = 'NATURAL',
  FORCED_STANDING = 'FORCED_STANDING',
  FORCED_LYING = 'FORCED_LYING',
  FORCED_SITTING = 'FORCED_SITTING',
  NON_THERAPEUTIC = 'NON_THERAPEUTIC',
  INVOLUNTARY = 'INVOLUNTARY',
  MANEGE = 'MANEGE',
  CIRCULAR = 'CIRCULAR',
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD',
  ROLLING = 'ROLLING',
}

export enum Constitution {
  LOOSE = 'LOOSE',
  DENSE = 'DENSE',
  HORSES = 'HORSES',
  BIRDS = 'BIRDS',
}

export enum Temperament {
  MELANCHOLIC = 'MELANCHOLIC',
  PHLEGMATIC = 'PHLEGMATIC',
}

export enum WoolType {
  EVEN = 'EVEN',
  UNEVEN = 'UNEVEN',
  LYING_FLAT = 'LYING_FLAT',
  SHINY = 'SHINY',
  MATTE = 'MATTE',
  NOT_FALLING = 'NOT_FALLING',
  DISHEVELED = 'DISHEVELED',
  MATTED = 'MATTED',
  BALD_PATCHES = 'BALD_PATCHES',
  THICK = 'THICK',
  SPARSE = 'SPARSE',
  PHYSIOLOGICAL_MOLT = 'PHYSIOLOGICAL_MOLT',
  PATHOLOGICAL_MOLT = 'PATHOLOGICAL_MOLT',
  FALLING = 'FALLING',
  NOT_FALLING_OUT = 'NOT_FALLING_OUT',
}

export enum DownType {
  DENSE = 'DENSE',
  SPARSE = 'SPARSE',
  NONE = 'NONE',
  SOFT = 'SOFT',
  SMOOTH = 'SMOOTH',
  MATTE = 'MATTE',
  SHINY = 'SHINY',
  DRY = 'DRY',
  DUSTY = 'DUSTY',
  EVEN = 'EVEN',
  WHITE = 'WHITE',
  GRAY = 'GRAY',
  YELLOWISH = 'YELLOWISH',
  DARK = 'DARK',
  MOIST = 'MOIST',
}

export enum HairType {
  COARSE = 'COARSE',
  SPARSE = 'SPARSE',
}

export enum FeatherType {
  SHINY = 'SHINY',
  MATTE = 'MATTE',
  FULL = 'FULL',
  FALLEN = 'FALLEN',
  BROKEN = 'BROKEN',
}

export enum SkinColor {
  PALE_VIOLET = 'PALE_VIOLET',
  PALE = 'PALE',
  RED = 'RED',
  BLUE = 'BLUE',
  YELLOW = 'YELLOW',
}

export enum SkinHumidity {
  MODERATE = 'MODERATE',
  HYPERHIDROSIS = 'HYPERHIDROSIS',
  LOCAL_SWEAT = 'LOCAL_SWEAT',
  DRY = 'DRY',
}

export enum SkinTemp {
  GENERAL_HIGH = 'GENERAL_HIGH',
  LOCAL_HIGH = 'LOCAL_HIGH',
  GENERAL_LOW = 'GENERAL_LOW',
  LOCAL_LOW = 'LOCAL_LOW',
  UNEVEN = 'UNEVEN',
}

export enum SkinElasticity {
  ELASTIC = 'ELASTIC',
  REDUCED = 'REDUCED',
  NONE = 'NONE',
}

export enum LymphSize {
  NORMAL = 'NORMAL',
  ENLARGED = 'ENLARGED',
}

export enum LymphShape {
  FLAT = 'FLAT',
  ROUND = 'ROUND',
  ENLARGED = 'ENLARGED',
  SWOLLEN = 'SWOLLEN',
}

export enum LymphSurface {
  SMOOTH = 'SMOOTH',
  ROUGH = 'ROUGH',
}

export enum LymphConsistency {
  DENSE = 'DENSE',
  SOFT = 'SOFT',
  SPECIFIC = 'SPECIFIC',
}

export enum LymphTemp {
  NORMAL = 'NORMAL',
  ELEVATED = 'ELEVATED',
}

export enum LymphPain {
  PAINLESS = 'PAINLESS',
  PAINFUL = 'PAINFUL',
}

export enum LymphMobility {
  MOBILE = 'MOBILE',
  LOW_MOBILITY = 'LOW_MOBILITY',
}

export enum MucosaType {
  ORAL = 'ORAL',
  NASAL = 'NASAL',
  OCULAR = 'OCULAR',
  REPRODUCTIVE = 'REPRODUCTIVE',
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

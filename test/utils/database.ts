import { PrismaClient } from '../../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

let prisma: PrismaClient;

export const getPrismaTestClient = (): PrismaClient => {
  if (!prisma) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
};

export const cleanupDatabase = async () => {
  const prisma = getPrismaTestClient();

  // =========================================================================
  // Delete in reverse order of dependencies.
  // Leaf tables (most dependent) first, root tables (no FK deps) last.
  // =========================================================================

  // --- Anomaly alerts (depends on Animal, MedicalSession) ---
  await prisma.anomalyAlert.deleteMany();

  // --- Feedback (depends on Prediction, VetProfile, User, Disease) ---
  await prisma.feedback.deleteMany();

  // --- Prediction (depends on MedicalSession) ---
  await prisma.prediction.deleteMany();

  // --- Five exam types (depend on Animal, MedicalSession, and lookup tables) ---
  await prisma.clinicalExam.deleteMany();
  await prisma.bloodExam.deleteMany();
  await prisma.urineExam.deleteMany();
  await prisma.fecesExam.deleteMany();
  await prisma.mucosaExam.deleteMany();

  // --- Medical sessions (depends on Animal, VetProfile) ---
  await prisma.medicalSession.deleteMany();

  // --- Prophylaxis chain (Prophylaxis depends on Animal, ProphylaxisItem, ProphylaxisDetail) ---
  await prisma.prophylaxis.deleteMany();
  await prisma.prophylaxisDetail.deleteMany();
  await prisma.prophylaxisItem.deleteMany();

  // --- Reference ranges (depends on AnimalType) ---
  await prisma.referenceRange.deleteMany();

  // --- Animals (depends on FarmerProfile, AnimalType, Breed, Color, AnimalSex) ---
  await prisma.animal.deleteMany();

  // --- Diseases & categories ---
  await prisma.disease.deleteMany();
  // Break self-referential FK (DiseaseCategory.parentId) before deleting
  await prisma.diseaseCategory.updateMany({ data: { parentId: null } });
  await prisma.diseaseCategory.deleteMany();

  // --- Clinical exam lookup tables (habitus) ---
  await prisma.bodyType.deleteMany();
  await prisma.obesityType.deleteMany();
  await prisma.bodyPosition.deleteMany();
  await prisma.constitution.deleteMany();
  await prisma.temperament.deleteMany();

  // --- Clinical exam lookup tables (skin cover) ---
  await prisma.woolType.deleteMany();
  await prisma.downType.deleteMany();
  await prisma.hairType.deleteMany();
  await prisma.featherType.deleteMany();

  // --- Clinical exam lookup tables (skin) ---
  await prisma.skinColor.deleteMany();
  await prisma.skinHumidity.deleteMany();
  await prisma.skinTemp.deleteMany();
  await prisma.skinElasticity.deleteMany();
  await prisma.skinSmell.deleteMany();
  await prisma.skinSurface.deleteMany();
  await prisma.skinSensitivity.deleteMany();
  await prisma.skinPain.deleteMany();

  // --- Clinical exam lookup tables (lymph nodes) ---
  await prisma.lymphSize.deleteMany();
  await prisma.lymphShape.deleteMany();
  await prisma.lymphSurface.deleteMany();
  await prisma.lymphConsistency.deleteMany();
  await prisma.lymphTemp.deleteMany();
  await prisma.lymphPain.deleteMany();
  await prisma.lymphMobility.deleteMany();

  // --- Clinical exam lookup tables (rumen fluid) ---
  await prisma.rumenFluidState.deleteMany();

  // --- Urine exam lookup tables (depend on AnimalType) ---
  await prisma.urineColor.deleteMany();
  await prisma.urineSmell.deleteMany();
  await prisma.urineClarity.deleteMany();
  await prisma.urineConsistency.deleteMany();

  // --- Feces exam lookup tables (depend on AnimalType) ---
  await prisma.fecesColor.deleteMany();
  await prisma.fecesSmell.deleteMany();
  await prisma.fecesConsistency.deleteMany();
  await prisma.fecesForm.deleteMany();

  // --- Mucosa lookup tables (depend on AnimalType, MucosaType) ---
  await prisma.mucosaAppearance.deleteMany();
  await prisma.mucosaType.deleteMany();

  // --- Inventory lookup tables ---
  await prisma.breed.deleteMany();
  await prisma.color.deleteMany();
  // Break self-referential FK (AnimalType.parentId) before deleting
  await prisma.animalType.updateMany({ data: { parentId: null } });
  await prisma.animalType.deleteMany();
  await prisma.animalSex.deleteMany();

  // --- Auth (FarmerProfile depends on User + VetProfile, VetProfile depends on User) ---
  await prisma.farmerProfile.deleteMany();
  await prisma.vetProfile.deleteMany();
  await prisma.user.deleteMany();

  // --- Management (VetStation depends on District, District depends on Region, User depends on District) ---
  await prisma.vetStation.deleteMany();
  await prisma.district.deleteMany();
  await prisma.region.deleteMany();
};

export const disconnectDatabase = async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
};

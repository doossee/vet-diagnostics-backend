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

  // Delete in reverse order of dependencies
  await prisma.clinicalExam.deleteMany();
  await prisma.bloodExam.deleteMany();
  await prisma.urineExam.deleteMany();
  await prisma.fecesExam.deleteMany();
  await prisma.mucosaExam.deleteMany();

  await prisma.prophylaxis.deleteMany();
  await prisma.prophylaxisDetail.deleteMany();
  await prisma.prophylaxisItem.deleteMany();

  await prisma.animal.deleteMany();
  await prisma.disease.deleteMany();
  await prisma.diseaseCategory.deleteMany();

  await prisma.urineColor.deleteMany();
  await prisma.urineSmell.deleteMany();
  await prisma.urineClarity.deleteMany();
  await prisma.urineConsistency.deleteMany();
  await prisma.fecesColor.deleteMany();
  await prisma.fecesSmell.deleteMany();
  await prisma.fecesConsistency.deleteMany();
  await prisma.fecesForm.deleteMany();
  await prisma.mucosaAppearance.deleteMany();

  await prisma.breed.deleteMany();
  await prisma.color.deleteMany();
  await prisma.animalType.deleteMany();

  await prisma.vetProfile.deleteMany();
  await prisma.farmerProfile.deleteMany();
  await prisma.user.deleteMany();

  await prisma.vetStation.deleteMany();
  await prisma.district.deleteMany();
  await prisma.region.deleteMany();
};

export const disconnectDatabase = async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
};

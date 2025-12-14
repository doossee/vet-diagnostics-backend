-- AlterTable
ALTER TABLE "blood_analyses" ADD COLUMN     "cobalt" DOUBLE PRECISION,
ADD COLUMN     "copper" DOUBLE PRECISION,
ADD COLUMN     "manganese" DOUBLE PRECISION,
ADD COLUMN     "zinc" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "clinical_analyses" ADD COLUMN     "rumen_fluid_state" TEXT,
ADD COLUMN     "rumen_infusoria_count" DOUBLE PRECISION;

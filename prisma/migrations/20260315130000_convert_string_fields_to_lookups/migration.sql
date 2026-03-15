-- CreateTable: SkinSmell lookup
CREATE TABLE "skin_smells" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" JSONB NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "skin_smells_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "skin_smells_numeric_value_key" ON "skin_smells"("numeric_value");

-- CreateTable: SkinSurface lookup
CREATE TABLE "skin_surfaces" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" JSONB NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "skin_surfaces_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "skin_surfaces_numeric_value_key" ON "skin_surfaces"("numeric_value");

-- CreateTable: SkinSensitivity lookup
CREATE TABLE "skin_sensitivities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" JSONB NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "skin_sensitivities_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "skin_sensitivities_numeric_value_key" ON "skin_sensitivities"("numeric_value");

-- CreateTable: SkinPain lookup
CREATE TABLE "skin_pains" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" JSONB NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "skin_pains_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "skin_pains_numeric_value_key" ON "skin_pains"("numeric_value");

-- CreateTable: RumenFluidState lookup
CREATE TABLE "rumen_fluid_states" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" JSONB NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "rumen_fluid_states_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "rumen_fluid_states_numeric_value_key" ON "rumen_fluid_states"("numeric_value");

-- AlterTable: Convert string columns to FK columns in clinical_analyses
ALTER TABLE "clinical_analyses" DROP COLUMN "skin_smell";
ALTER TABLE "clinical_analyses" DROP COLUMN "skin_surface";
ALTER TABLE "clinical_analyses" DROP COLUMN "skin_sensitivity";
ALTER TABLE "clinical_analyses" DROP COLUMN "skin_pain";
ALTER TABLE "clinical_analyses" DROP COLUMN "rumen_fluid_state";

ALTER TABLE "clinical_analyses" ADD COLUMN "skin_smell_id" UUID;
ALTER TABLE "clinical_analyses" ADD COLUMN "skin_surface_id" UUID;
ALTER TABLE "clinical_analyses" ADD COLUMN "skin_sensitivity_id" UUID;
ALTER TABLE "clinical_analyses" ADD COLUMN "skin_pain_id" UUID;
ALTER TABLE "clinical_analyses" ADD COLUMN "rumen_fluid_state_id" UUID;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_skin_smell_id_fkey" FOREIGN KEY ("skin_smell_id") REFERENCES "skin_smells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_skin_surface_id_fkey" FOREIGN KEY ("skin_surface_id") REFERENCES "skin_surfaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_skin_sensitivity_id_fkey" FOREIGN KEY ("skin_sensitivity_id") REFERENCES "skin_sensitivities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_skin_pain_id_fkey" FOREIGN KEY ("skin_pain_id") REFERENCES "skin_pains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_rumen_fluid_state_id_fkey" FOREIGN KEY ("rumen_fluid_state_id") REFERENCES "rumen_fluid_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

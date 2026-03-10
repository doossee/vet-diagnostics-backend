/*
  Warnings:

  - You are about to drop the column `sex` on the `animals` table. All the data in the column will be lost.
  - You are about to drop the column `body_position` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `body_type` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `constitution` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `down` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `feathers` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `hair` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `lymph_consistency` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `lymph_mobility` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `lymph_pain` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `lymph_shape` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `lymph_size` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `lymph_surface` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `lymph_temp` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `obesity` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `skin_color` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `skin_elasticity` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `skin_humidity` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `skin_temp` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `temperament` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `wool` on the `clinical_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `mucosa_type` on the `mucosa_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `mucosa_type` on the `mucosa_appearances` table. All the data in the column will be lost.
  - Added the required column `numeric_value` to the `feces_colors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeric_value` to the `feces_consistencies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeric_value` to the `feces_forms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeric_value` to the `feces_smells` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeric_value` to the `mucosa_appearances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeric_value` to the `urine_clarities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeric_value` to the `urine_colors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeric_value` to the `urine_consistencies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeric_value` to the `urine_smells` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "animals_sex_idx";

-- AlterTable
ALTER TABLE "animals" DROP COLUMN "sex",
ADD COLUMN     "sex_id" UUID;

-- AlterTable
ALTER TABLE "clinical_analyses" DROP COLUMN "body_position",
DROP COLUMN "body_type",
DROP COLUMN "constitution",
DROP COLUMN "down",
DROP COLUMN "feathers",
DROP COLUMN "hair",
DROP COLUMN "lymph_consistency",
DROP COLUMN "lymph_mobility",
DROP COLUMN "lymph_pain",
DROP COLUMN "lymph_shape",
DROP COLUMN "lymph_size",
DROP COLUMN "lymph_surface",
DROP COLUMN "lymph_temp",
DROP COLUMN "obesity",
DROP COLUMN "skin_color",
DROP COLUMN "skin_elasticity",
DROP COLUMN "skin_humidity",
DROP COLUMN "skin_temp",
DROP COLUMN "temperament",
DROP COLUMN "wool",
ADD COLUMN     "body_position_id" UUID,
ADD COLUMN     "body_type_id" UUID,
ADD COLUMN     "constitution_id" UUID,
ADD COLUMN     "down_id" UUID,
ADD COLUMN     "feathers_id" UUID,
ADD COLUMN     "hair_id" UUID,
ADD COLUMN     "lymph_consistency_id" UUID,
ADD COLUMN     "lymph_mobility_id" UUID,
ADD COLUMN     "lymph_pain_id" UUID,
ADD COLUMN     "lymph_shape_id" UUID,
ADD COLUMN     "lymph_size_id" UUID,
ADD COLUMN     "lymph_surface_id" UUID,
ADD COLUMN     "lymph_temp_id" UUID,
ADD COLUMN     "obesity_id" UUID,
ADD COLUMN     "skin_color_id" UUID,
ADD COLUMN     "skin_elasticity_id" UUID,
ADD COLUMN     "skin_humidity_id" UUID,
ADD COLUMN     "skin_temp_id" UUID,
ADD COLUMN     "temperament_id" UUID,
ADD COLUMN     "wool_id" UUID;

-- AlterTable
ALTER TABLE "feces_colors" ADD COLUMN     "numeric_value" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "feces_consistencies" ADD COLUMN     "numeric_value" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "feces_forms" ADD COLUMN     "numeric_value" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "feces_smells" ADD COLUMN     "numeric_value" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "mucosa_analyses" DROP COLUMN "mucosa_type",
ADD COLUMN     "mucosa_type_id" UUID;

-- AlterTable
ALTER TABLE "mucosa_appearances" DROP COLUMN "mucosa_type",
ADD COLUMN     "mucosa_type_id" UUID,
ADD COLUMN     "numeric_value" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "urine_clarities" ADD COLUMN     "numeric_value" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "urine_colors" ADD COLUMN     "numeric_value" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "urine_consistencies" ADD COLUMN     "numeric_value" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "urine_smells" ADD COLUMN     "numeric_value" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "AnimalSex";

-- DropEnum
DROP TYPE "BodyPosition";

-- DropEnum
DROP TYPE "BodyType";

-- DropEnum
DROP TYPE "Constitution";

-- DropEnum
DROP TYPE "DownType";

-- DropEnum
DROP TYPE "FeatherType";

-- DropEnum
DROP TYPE "HairType";

-- DropEnum
DROP TYPE "LymphConsistency";

-- DropEnum
DROP TYPE "LymphMobility";

-- DropEnum
DROP TYPE "LymphPain";

-- DropEnum
DROP TYPE "LymphShape";

-- DropEnum
DROP TYPE "LymphSize";

-- DropEnum
DROP TYPE "LymphSurface";

-- DropEnum
DROP TYPE "LymphTemp";

-- DropEnum
DROP TYPE "MucosaType";

-- DropEnum
DROP TYPE "ObesityType";

-- DropEnum
DROP TYPE "SkinColor";

-- DropEnum
DROP TYPE "SkinElasticity";

-- DropEnum
DROP TYPE "SkinHumidity";

-- DropEnum
DROP TYPE "SkinTemp";

-- DropEnum
DROP TYPE "Temperament";

-- DropEnum
DROP TYPE "WoolType";

-- CreateTable
CREATE TABLE "body_types" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "body_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obesity_types" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "obesity_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "body_positions" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "body_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constitutions" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "constitutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temperaments" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "temperaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wool_types" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "wool_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "down_types" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "down_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hair_types" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "hair_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feather_types" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "feather_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skin_colors" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "skin_colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skin_humidities" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "skin_humidities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skin_temps" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "skin_temps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skin_elasticities" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "skin_elasticities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lymph_sizes" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "lymph_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lymph_shapes" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "lymph_shapes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lymph_surfaces" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "lymph_surfaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lymph_consistencies" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "lymph_consistencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lymph_temps" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "lymph_temps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lymph_pains" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "lymph_pains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lymph_mobilities" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "lymph_mobilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mucosa_types" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "mucosa_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal_sexes" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "numeric_value" INTEGER NOT NULL,

    CONSTRAINT "animal_sexes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "body_types_numeric_value_key" ON "body_types"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "obesity_types_numeric_value_key" ON "obesity_types"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "body_positions_numeric_value_key" ON "body_positions"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "constitutions_numeric_value_key" ON "constitutions"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "temperaments_numeric_value_key" ON "temperaments"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "wool_types_numeric_value_key" ON "wool_types"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "down_types_numeric_value_key" ON "down_types"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "hair_types_numeric_value_key" ON "hair_types"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "feather_types_numeric_value_key" ON "feather_types"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "skin_colors_numeric_value_key" ON "skin_colors"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "skin_humidities_numeric_value_key" ON "skin_humidities"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "skin_temps_numeric_value_key" ON "skin_temps"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "skin_elasticities_numeric_value_key" ON "skin_elasticities"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "lymph_sizes_numeric_value_key" ON "lymph_sizes"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "lymph_shapes_numeric_value_key" ON "lymph_shapes"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "lymph_surfaces_numeric_value_key" ON "lymph_surfaces"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "lymph_consistencies_numeric_value_key" ON "lymph_consistencies"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "lymph_temps_numeric_value_key" ON "lymph_temps"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "lymph_pains_numeric_value_key" ON "lymph_pains"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "lymph_mobilities_numeric_value_key" ON "lymph_mobilities"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "mucosa_types_numeric_value_key" ON "mucosa_types"("numeric_value");

-- CreateIndex
CREATE UNIQUE INDEX "animal_sexes_numeric_value_key" ON "animal_sexes"("numeric_value");

-- CreateIndex
CREATE INDEX "animals_sex_id_idx" ON "animals"("sex_id");

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_body_type_id_fkey" FOREIGN KEY ("body_type_id") REFERENCES "body_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_obesity_id_fkey" FOREIGN KEY ("obesity_id") REFERENCES "obesity_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_body_position_id_fkey" FOREIGN KEY ("body_position_id") REFERENCES "body_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_constitution_id_fkey" FOREIGN KEY ("constitution_id") REFERENCES "constitutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_temperament_id_fkey" FOREIGN KEY ("temperament_id") REFERENCES "temperaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_wool_id_fkey" FOREIGN KEY ("wool_id") REFERENCES "wool_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_down_id_fkey" FOREIGN KEY ("down_id") REFERENCES "down_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_hair_id_fkey" FOREIGN KEY ("hair_id") REFERENCES "hair_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_feathers_id_fkey" FOREIGN KEY ("feathers_id") REFERENCES "feather_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_skin_color_id_fkey" FOREIGN KEY ("skin_color_id") REFERENCES "skin_colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_skin_humidity_id_fkey" FOREIGN KEY ("skin_humidity_id") REFERENCES "skin_humidities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_skin_temp_id_fkey" FOREIGN KEY ("skin_temp_id") REFERENCES "skin_temps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_skin_elasticity_id_fkey" FOREIGN KEY ("skin_elasticity_id") REFERENCES "skin_elasticities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_lymph_size_id_fkey" FOREIGN KEY ("lymph_size_id") REFERENCES "lymph_sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_lymph_shape_id_fkey" FOREIGN KEY ("lymph_shape_id") REFERENCES "lymph_shapes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_lymph_surface_id_fkey" FOREIGN KEY ("lymph_surface_id") REFERENCES "lymph_surfaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_lymph_consistency_id_fkey" FOREIGN KEY ("lymph_consistency_id") REFERENCES "lymph_consistencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_lymph_temp_id_fkey" FOREIGN KEY ("lymph_temp_id") REFERENCES "lymph_temps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_lymph_pain_id_fkey" FOREIGN KEY ("lymph_pain_id") REFERENCES "lymph_pains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_lymph_mobility_id_fkey" FOREIGN KEY ("lymph_mobility_id") REFERENCES "lymph_mobilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mucosa_analyses" ADD CONSTRAINT "mucosa_analyses_mucosa_type_id_fkey" FOREIGN KEY ("mucosa_type_id") REFERENCES "mucosa_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mucosa_appearances" ADD CONSTRAINT "mucosa_appearances_mucosa_type_id_fkey" FOREIGN KEY ("mucosa_type_id") REFERENCES "mucosa_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_sex_id_fkey" FOREIGN KEY ("sex_id") REFERENCES "animal_sexes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

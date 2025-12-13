/*
  Warnings:

  - A unique constraint covering the columns `[animal_name_code]` on the table `animals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `animal_name_code` to the `animals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "animals" ADD COLUMN     "animal_name_code" VARCHAR(50) NOT NULL,
ALTER COLUMN "farmer_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "animals_animal_name_code_key" ON "animals"("animal_name_code");

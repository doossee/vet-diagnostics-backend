/*
  Warnings:

  - You are about to drop the column `analysis_type` on the `urine_analyses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "urine_analyses" DROP COLUMN "analysis_type";

-- DropEnum
DROP TYPE "FecesAnalysisType";

-- DropEnum
DROP TYPE "UrineAnalysisType";

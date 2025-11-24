/*
  Warnings:

  - Added the required column `date` to the `prophylactic_records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prophylactic_records" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "prophylactic_records_date_idx" ON "prophylactic_records"("date");

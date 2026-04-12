-- Add notes column to prophylactic_records
ALTER TABLE "prophylactic_records" ADD COLUMN IF NOT EXISTS "notes" TEXT;

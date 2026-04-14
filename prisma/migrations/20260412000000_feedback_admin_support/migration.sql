-- Make veterinarian_id nullable on feedbacks (admins don't have a VetProfile)
ALTER TABLE "feedbacks" ALTER COLUMN "veterinarian_id" DROP NOT NULL;

-- Add admin_id column (FK to users table)
ALTER TABLE "feedbacks" ADD COLUMN IF NOT EXISTS "admin_id" UUID;

-- Add FK constraint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_admin_id_fkey"
  FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add index
CREATE INDEX IF NOT EXISTS "feedbacks_admin_id_idx" ON "feedbacks"("admin_id");

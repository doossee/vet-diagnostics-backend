-- Split Animal.age into ageYears + ageMonths, and add sex/age-range constraints to AnimalType.

-- =============================================================================
-- ANIMAL TABLE — replace single age column with ageYears + ageMonths
-- =============================================================================

ALTER TABLE "animals" RENAME COLUMN "age" TO "age_years";
ALTER TABLE "animals" ADD COLUMN "age_months" SMALLINT NOT NULL DEFAULT 0;

-- =============================================================================
-- ANIMAL_TYPES TABLE — add modelKey, optional sex constraint, age range
-- =============================================================================

ALTER TABLE "animal_types" ADD COLUMN "model_key" VARCHAR(100);
ALTER TABLE "animal_types" ADD COLUMN "sex_id" UUID;
ALTER TABLE "animal_types" ADD COLUMN "min_age_months" SMALLINT;
ALTER TABLE "animal_types" ADD COLUMN "max_age_months" SMALLINT;

CREATE UNIQUE INDEX "animal_types_model_key_key" ON "animal_types"("model_key");

ALTER TABLE "animal_types"
  ADD CONSTRAINT "animal_types_sex_id_fkey"
  FOREIGN KEY ("sex_id") REFERENCES "animal_sexes"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "animal_types_sex_id_idx" ON "animal_types"("sex_id");

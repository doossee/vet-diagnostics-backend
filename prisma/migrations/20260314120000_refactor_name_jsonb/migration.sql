-- Refactor: Replace name_ru/name_uz VARCHAR columns with a single name JSONB column
-- across all lookup and reference tables.

-- =============================================================================
-- MANAGEMENT TABLES
-- =============================================================================

-- regions
ALTER TABLE "regions" ADD COLUMN "name" JSONB;
UPDATE "regions" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "regions" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "regions" DROP CONSTRAINT IF EXISTS "regions_name_ru_key";
ALTER TABLE "regions" DROP CONSTRAINT IF EXISTS "regions_name_uz_key";
ALTER TABLE "regions" DROP COLUMN "name_ru";
ALTER TABLE "regions" DROP COLUMN "name_uz";

-- districts
ALTER TABLE "districts" ADD COLUMN "name" JSONB;
UPDATE "districts" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "districts" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "districts" DROP COLUMN "name_ru";
ALTER TABLE "districts" DROP COLUMN "name_uz";

-- vet_stations
ALTER TABLE "vet_stations" ADD COLUMN "name" JSONB;
UPDATE "vet_stations" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "vet_stations" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "vet_stations" DROP COLUMN "name_ru";
ALTER TABLE "vet_stations" DROP COLUMN "name_uz";

-- =============================================================================
-- INVENTORY TABLES
-- =============================================================================

-- animal_sexes
ALTER TABLE "animal_sexes" ADD COLUMN "name" JSONB;
UPDATE "animal_sexes" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "animal_sexes" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "animal_sexes" DROP COLUMN "name_ru";
ALTER TABLE "animal_sexes" DROP COLUMN "name_uz";

-- animal_types
ALTER TABLE "animal_types" ADD COLUMN "name" JSONB;
UPDATE "animal_types" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "animal_types" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "animal_types" DROP CONSTRAINT IF EXISTS "animal_types_name_ru_key";
ALTER TABLE "animal_types" DROP CONSTRAINT IF EXISTS "animal_types_name_uz_key";
ALTER TABLE "animal_types" DROP COLUMN "name_ru";
ALTER TABLE "animal_types" DROP COLUMN "name_uz";

-- animal_breeds
ALTER TABLE "animal_breeds" ADD COLUMN "name" JSONB;
UPDATE "animal_breeds" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "animal_breeds" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "animal_breeds" DROP COLUMN "name_ru";
ALTER TABLE "animal_breeds" DROP COLUMN "name_uz";

-- animal_colors
ALTER TABLE "animal_colors" ADD COLUMN "name" JSONB;
UPDATE "animal_colors" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "animal_colors" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "animal_colors" DROP COLUMN "name_ru";
ALTER TABLE "animal_colors" DROP COLUMN "name_uz";

-- =============================================================================
-- MEDICAL TABLES
-- =============================================================================

-- diseases
ALTER TABLE "diseases" ADD COLUMN "name" JSONB;
UPDATE "diseases" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "diseases" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "diseases" DROP COLUMN "name_ru";
ALTER TABLE "diseases" DROP COLUMN "name_uz";

-- disease_categories
ALTER TABLE "disease_categories" ADD COLUMN "name" JSONB;
UPDATE "disease_categories" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "disease_categories" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "disease_categories" DROP COLUMN "name_ru";
ALTER TABLE "disease_categories" DROP COLUMN "name_uz";

-- prophylactic_items
ALTER TABLE "prophylactic_items" ADD COLUMN "name" JSONB;
UPDATE "prophylactic_items" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "prophylactic_items" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "prophylactic_items" DROP COLUMN "name_ru";
ALTER TABLE "prophylactic_items" DROP COLUMN "name_uz";

-- prophylactic_details
ALTER TABLE "prophylactic_details" ADD COLUMN "name" JSONB;
UPDATE "prophylactic_details" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "prophylactic_details" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "prophylactic_details" DROP COLUMN "name_ru";
ALTER TABLE "prophylactic_details" DROP COLUMN "name_uz";

-- =============================================================================
-- CLINICAL EXAM LOOKUP TABLES
-- =============================================================================

-- body_types
ALTER TABLE "body_types" ADD COLUMN "name" JSONB;
UPDATE "body_types" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "body_types" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "body_types" DROP COLUMN "name_ru";
ALTER TABLE "body_types" DROP COLUMN "name_uz";

-- obesity_types
ALTER TABLE "obesity_types" ADD COLUMN "name" JSONB;
UPDATE "obesity_types" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "obesity_types" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "obesity_types" DROP COLUMN "name_ru";
ALTER TABLE "obesity_types" DROP COLUMN "name_uz";

-- body_positions
ALTER TABLE "body_positions" ADD COLUMN "name" JSONB;
UPDATE "body_positions" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "body_positions" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "body_positions" DROP COLUMN "name_ru";
ALTER TABLE "body_positions" DROP COLUMN "name_uz";

-- constitutions
ALTER TABLE "constitutions" ADD COLUMN "name" JSONB;
UPDATE "constitutions" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "constitutions" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "constitutions" DROP COLUMN "name_ru";
ALTER TABLE "constitutions" DROP COLUMN "name_uz";

-- temperaments
ALTER TABLE "temperaments" ADD COLUMN "name" JSONB;
UPDATE "temperaments" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "temperaments" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "temperaments" DROP COLUMN "name_ru";
ALTER TABLE "temperaments" DROP COLUMN "name_uz";

-- wool_types
ALTER TABLE "wool_types" ADD COLUMN "name" JSONB;
UPDATE "wool_types" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "wool_types" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "wool_types" DROP COLUMN "name_ru";
ALTER TABLE "wool_types" DROP COLUMN "name_uz";

-- down_types
ALTER TABLE "down_types" ADD COLUMN "name" JSONB;
UPDATE "down_types" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "down_types" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "down_types" DROP COLUMN "name_ru";
ALTER TABLE "down_types" DROP COLUMN "name_uz";

-- hair_types
ALTER TABLE "hair_types" ADD COLUMN "name" JSONB;
UPDATE "hair_types" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "hair_types" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "hair_types" DROP COLUMN "name_ru";
ALTER TABLE "hair_types" DROP COLUMN "name_uz";

-- feather_types
ALTER TABLE "feather_types" ADD COLUMN "name" JSONB;
UPDATE "feather_types" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "feather_types" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "feather_types" DROP COLUMN "name_ru";
ALTER TABLE "feather_types" DROP COLUMN "name_uz";

-- skin_colors
ALTER TABLE "skin_colors" ADD COLUMN "name" JSONB;
UPDATE "skin_colors" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "skin_colors" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "skin_colors" DROP COLUMN "name_ru";
ALTER TABLE "skin_colors" DROP COLUMN "name_uz";

-- skin_humidities
ALTER TABLE "skin_humidities" ADD COLUMN "name" JSONB;
UPDATE "skin_humidities" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "skin_humidities" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "skin_humidities" DROP COLUMN "name_ru";
ALTER TABLE "skin_humidities" DROP COLUMN "name_uz";

-- skin_temps
ALTER TABLE "skin_temps" ADD COLUMN "name" JSONB;
UPDATE "skin_temps" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "skin_temps" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "skin_temps" DROP COLUMN "name_ru";
ALTER TABLE "skin_temps" DROP COLUMN "name_uz";

-- skin_elasticities
ALTER TABLE "skin_elasticities" ADD COLUMN "name" JSONB;
UPDATE "skin_elasticities" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "skin_elasticities" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "skin_elasticities" DROP COLUMN "name_ru";
ALTER TABLE "skin_elasticities" DROP COLUMN "name_uz";

-- =============================================================================
-- LYMPH NODE LOOKUP TABLES
-- =============================================================================

-- lymph_sizes
ALTER TABLE "lymph_sizes" ADD COLUMN "name" JSONB;
UPDATE "lymph_sizes" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "lymph_sizes" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "lymph_sizes" DROP COLUMN "name_ru";
ALTER TABLE "lymph_sizes" DROP COLUMN "name_uz";

-- lymph_shapes
ALTER TABLE "lymph_shapes" ADD COLUMN "name" JSONB;
UPDATE "lymph_shapes" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "lymph_shapes" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "lymph_shapes" DROP COLUMN "name_ru";
ALTER TABLE "lymph_shapes" DROP COLUMN "name_uz";

-- lymph_surfaces
ALTER TABLE "lymph_surfaces" ADD COLUMN "name" JSONB;
UPDATE "lymph_surfaces" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "lymph_surfaces" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "lymph_surfaces" DROP COLUMN "name_ru";
ALTER TABLE "lymph_surfaces" DROP COLUMN "name_uz";

-- lymph_consistencies
ALTER TABLE "lymph_consistencies" ADD COLUMN "name" JSONB;
UPDATE "lymph_consistencies" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "lymph_consistencies" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "lymph_consistencies" DROP COLUMN "name_ru";
ALTER TABLE "lymph_consistencies" DROP COLUMN "name_uz";

-- lymph_temps
ALTER TABLE "lymph_temps" ADD COLUMN "name" JSONB;
UPDATE "lymph_temps" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "lymph_temps" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "lymph_temps" DROP COLUMN "name_ru";
ALTER TABLE "lymph_temps" DROP COLUMN "name_uz";

-- lymph_pains
ALTER TABLE "lymph_pains" ADD COLUMN "name" JSONB;
UPDATE "lymph_pains" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "lymph_pains" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "lymph_pains" DROP COLUMN "name_ru";
ALTER TABLE "lymph_pains" DROP COLUMN "name_uz";

-- lymph_mobilities
ALTER TABLE "lymph_mobilities" ADD COLUMN "name" JSONB;
UPDATE "lymph_mobilities" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "lymph_mobilities" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "lymph_mobilities" DROP COLUMN "name_ru";
ALTER TABLE "lymph_mobilities" DROP COLUMN "name_uz";

-- =============================================================================
-- URINE LOOKUP TABLES
-- =============================================================================

-- urine_colors
ALTER TABLE "urine_colors" ADD COLUMN "name" JSONB;
UPDATE "urine_colors" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "urine_colors" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "urine_colors" DROP COLUMN "name_ru";
ALTER TABLE "urine_colors" DROP COLUMN "name_uz";

-- urine_smells
ALTER TABLE "urine_smells" ADD COLUMN "name" JSONB;
UPDATE "urine_smells" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "urine_smells" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "urine_smells" DROP COLUMN "name_ru";
ALTER TABLE "urine_smells" DROP COLUMN "name_uz";

-- urine_clarities
ALTER TABLE "urine_clarities" ADD COLUMN "name" JSONB;
UPDATE "urine_clarities" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "urine_clarities" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "urine_clarities" DROP COLUMN "name_ru";
ALTER TABLE "urine_clarities" DROP COLUMN "name_uz";

-- urine_consistencies
ALTER TABLE "urine_consistencies" ADD COLUMN "name" JSONB;
UPDATE "urine_consistencies" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "urine_consistencies" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "urine_consistencies" DROP COLUMN "name_ru";
ALTER TABLE "urine_consistencies" DROP COLUMN "name_uz";

-- =============================================================================
-- FECES LOOKUP TABLES
-- =============================================================================

-- feces_colors
ALTER TABLE "feces_colors" ADD COLUMN "name" JSONB;
UPDATE "feces_colors" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "feces_colors" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "feces_colors" DROP COLUMN "name_ru";
ALTER TABLE "feces_colors" DROP COLUMN "name_uz";

-- feces_smells
ALTER TABLE "feces_smells" ADD COLUMN "name" JSONB;
UPDATE "feces_smells" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "feces_smells" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "feces_smells" DROP COLUMN "name_ru";
ALTER TABLE "feces_smells" DROP COLUMN "name_uz";

-- feces_consistencies
ALTER TABLE "feces_consistencies" ADD COLUMN "name" JSONB;
UPDATE "feces_consistencies" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "feces_consistencies" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "feces_consistencies" DROP COLUMN "name_ru";
ALTER TABLE "feces_consistencies" DROP COLUMN "name_uz";

-- feces_forms
ALTER TABLE "feces_forms" ADD COLUMN "name" JSONB;
UPDATE "feces_forms" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "feces_forms" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "feces_forms" DROP COLUMN "name_ru";
ALTER TABLE "feces_forms" DROP COLUMN "name_uz";

-- =============================================================================
-- MUCOSA LOOKUP TABLES
-- =============================================================================

-- mucosa_types
ALTER TABLE "mucosa_types" ADD COLUMN "name" JSONB;
UPDATE "mucosa_types" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "mucosa_types" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "mucosa_types" DROP COLUMN "name_ru";
ALTER TABLE "mucosa_types" DROP COLUMN "name_uz";

-- mucosa_appearances
ALTER TABLE "mucosa_appearances" ADD COLUMN "name" JSONB;
UPDATE "mucosa_appearances" SET "name" = jsonb_build_object('ru', "name_ru", 'uz', "name_uz");
ALTER TABLE "mucosa_appearances" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "mucosa_appearances" DROP COLUMN "name_ru";
ALTER TABLE "mucosa_appearances" DROP COLUMN "name_uz";

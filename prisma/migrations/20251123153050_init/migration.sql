-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'VETERINARIAN', 'FARMER');

-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('STRONG', 'MEDIUM', 'WEAK');

-- CreateEnum
CREATE TYPE "ObesityType" AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'CACHEXIA');

-- CreateEnum
CREATE TYPE "BodyPosition" AS ENUM ('NATURAL', 'FORCED_STANDING', 'FORCED_LYING', 'FORCED_SITTING', 'NON_THERAPEUTIC', 'INVOLUNTARY', 'MANEGE', 'CIRCULAR', 'FORWARD', 'BACKWARD', 'ROLLING');

-- CreateEnum
CREATE TYPE "Constitution" AS ENUM ('LOOSE', 'DENSE', 'HORSES', 'BIRDS');

-- CreateEnum
CREATE TYPE "Temperament" AS ENUM ('MELANCHOLIC', 'PHLEGMATIC');

-- CreateEnum
CREATE TYPE "WoolType" AS ENUM ('EVEN', 'UNEVEN', 'LYING_FLAT', 'SHINY', 'MATTE', 'NOT_FALLING', 'DISHEVELED', 'MATTED', 'BALD_PATCHES', 'THICK', 'SPARSE', 'PHYSIOLOGICAL_MOLT', 'PATHOLOGICAL_MOLT', 'FALLING', 'NOT_FALLING_OUT');

-- CreateEnum
CREATE TYPE "DownType" AS ENUM ('DENSE', 'SPARSE', 'NONE', 'SOFT', 'SMOOTH', 'MATTE', 'SHINY', 'DRY', 'DUSTY', 'EVEN', 'WHITE', 'GRAY', 'YELLOWISH', 'DARK', 'MOIST');

-- CreateEnum
CREATE TYPE "HairType" AS ENUM ('COARSE', 'SPARSE');

-- CreateEnum
CREATE TYPE "FeatherType" AS ENUM ('SHINY', 'MATTE', 'FULL', 'FALLEN', 'BROKEN');

-- CreateEnum
CREATE TYPE "SkinColor" AS ENUM ('PALE_VIOLET', 'PALE', 'RED', 'BLUE', 'YELLOW');

-- CreateEnum
CREATE TYPE "SkinHumidity" AS ENUM ('MODERATE', 'HYPERHIDROSIS', 'LOCAL_SWEAT', 'DRY');

-- CreateEnum
CREATE TYPE "SkinTemp" AS ENUM ('GENERAL_HIGH', 'LOCAL_HIGH', 'GENERAL_LOW', 'LOCAL_LOW', 'UNEVEN');

-- CreateEnum
CREATE TYPE "SkinElasticity" AS ENUM ('ELASTIC', 'REDUCED', 'NONE');

-- CreateEnum
CREATE TYPE "LymphSize" AS ENUM ('NORMAL', 'ENLARGED');

-- CreateEnum
CREATE TYPE "LymphShape" AS ENUM ('FLAT', 'ROUND', 'ENLARGED', 'SWOLLEN');

-- CreateEnum
CREATE TYPE "LymphSurface" AS ENUM ('SMOOTH', 'ROUGH');

-- CreateEnum
CREATE TYPE "LymphConsistency" AS ENUM ('DENSE', 'SOFT', 'SPECIFIC');

-- CreateEnum
CREATE TYPE "LymphTemp" AS ENUM ('NORMAL', 'ELEVATED');

-- CreateEnum
CREATE TYPE "LymphPain" AS ENUM ('PAINLESS', 'PAINFUL');

-- CreateEnum
CREATE TYPE "LymphMobility" AS ENUM ('MOBILE', 'LOW_MOBILITY');

-- CreateEnum
CREATE TYPE "UrineAnalysisType" AS ENUM ('LABORATORY', 'MACROSCOPIC', 'MICROSCOPIC');

-- CreateEnum
CREATE TYPE "FecesAnalysisType" AS ENUM ('MACROSCOPIC', 'MICROSCOPIC');

-- CreateEnum
CREATE TYPE "MucosaType" AS ENUM ('ORAL', 'NASAL', 'OCULAR', 'REPRODUCTIVE');

-- CreateEnum
CREATE TYPE "AnimalSex" AS ENUM ('MALE', 'FEMALE', 'NEUTERED', 'SPAYED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ProphylaxisType" AS ENUM ('VACCINE', 'IMMUNIZATION', 'DEWORMING');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255),
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "avatar" VARCHAR(500),
    "gender" "UserGender",
    "birth_date" DATE,
    "address" VARCHAR(255),
    "role" "UserRole" NOT NULL DEFAULT 'SUPER_ADMIN',
    "district_id" UUID NOT NULL,
    "refresh_token_hash" VARCHAR(255),
    "token_expires_at" TIMESTAMP(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veterinarians" (
    "user_id" UUID NOT NULL,
    "license_number" VARCHAR(50),
    "specialization" VARCHAR(100),
    "experience" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "veterinarians_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "farmers" (
    "user_id" UUID NOT NULL,
    "veterinarian_id" UUID NOT NULL,
    "farm_name" VARCHAR(100),
    "farm_size" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farmers_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "clinical_analyses" (
    "id" UUID NOT NULL,
    "animal_id" UUID NOT NULL,
    "pulse" INTEGER,
    "rumination" INTEGER,
    "temperature" DOUBLE PRECISION,
    "respiratory_rate" DOUBLE PRECISION,
    "body_type" "BodyType",
    "obesity" "ObesityType",
    "body_position" "BodyPosition",
    "constitution" "Constitution",
    "temperament" "Temperament",
    "wool" "WoolType",
    "down" "DownType",
    "hair" "HairType",
    "feathers" "FeatherType",
    "skin_color" "SkinColor",
    "skin_humidity" "SkinHumidity",
    "skin_smell" TEXT,
    "skin_temp" "SkinTemp",
    "skin_surface" TEXT,
    "skin_elasticity" "SkinElasticity",
    "skin_sensitivity" TEXT,
    "skin_pain" TEXT,
    "lymph_size" "LymphSize",
    "lymph_shape" "LymphShape",
    "lymph_surface" "LymphSurface",
    "lymph_consistency" "LymphConsistency",
    "lymph_temp" "LymphTemp",
    "lymph_pain" "LymphPain",
    "lymph_mobility" "LymphMobility",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinical_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_analyses" (
    "id" UUID NOT NULL,
    "animal_id" UUID,
    "coe" DOUBLE PRECISION,
    "erythrocyte_count" DOUBLE PRECISION,
    "leukocyte_count" DOUBLE PRECISION,
    "thrombocyte_count" DOUBLE PRECISION,
    "hemoglobin" DOUBLE PRECISION,
    "glutathione" DOUBLE PRECISION,
    "water_percentage" DOUBLE PRECISION,
    "dry_residue" DOUBLE PRECISION,
    "total_protein" DOUBLE PRECISION,
    "total_calcium" DOUBLE PRECISION,
    "organic_phosphorus" DOUBLE PRECISION,
    "albumin" DOUBLE PRECISION,
    "alpha_globulin" DOUBLE PRECISION,
    "beta_globulin" DOUBLE PRECISION,
    "gamma_globulin" DOUBLE PRECISION,
    "residual_nitrogen" DOUBLE PRECISION,
    "urea" DOUBLE PRECISION,
    "uric_acid" DOUBLE PRECISION,
    "creatine" DOUBLE PRECISION,
    "creatinine" DOUBLE PRECISION,
    "alkaline_reserve" DOUBLE PRECISION,
    "glucose" DOUBLE PRECISION,
    "ketone_bodies" DOUBLE PRECISION,
    "total_bilirubin" DOUBLE PRECISION,
    "direct_bilirubin" DOUBLE PRECISION,
    "total_cholesterol" DOUBLE PRECISION,
    "total_lipids" DOUBLE PRECISION,
    "phospholipids" DOUBLE PRECISION,
    "lactic_acid" DOUBLE PRECISION,
    "pyruvic_acid" DOUBLE PRECISION,
    "citric_acid" DOUBLE PRECISION,
    "carotene" DOUBLE PRECISION,
    "vitamin_a" DOUBLE PRECISION,
    "vitamin_b" DOUBLE PRECISION,
    "vitamin_c" DOUBLE PRECISION,
    "conclusion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blood_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "urine_analyses" (
    "id" UUID NOT NULL,
    "analysis_type" "UrineAnalysisType" NOT NULL,
    "animal_id" UUID,
    "urine_color_id" UUID,
    "amount" DOUBLE PRECISION,
    "urine_clarity_id" UUID,
    "urine_consistency_id" UUID,
    "urine_smell_id" UUID,
    "ph" DOUBLE PRECISION,
    "acetone" DOUBLE PRECISION,
    "protein" DOUBLE PRECISION,
    "bilirubin" DOUBLE PRECISION,
    "urobilinogen" DOUBLE PRECISION,
    "sugar" DOUBLE PRECISION,
    "leukocytes" DOUBLE PRECISION,
    "epithelium" DOUBLE PRECISION,
    "microbial_bodies" DOUBLE PRECISION,
    "erythrocytes" DOUBLE PRECISION,
    "salt_crystals" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "urine_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "urine_colors" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "animal_type_id" UUID NOT NULL,

    CONSTRAINT "urine_colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "urine_smells" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "animal_type_id" UUID NOT NULL,

    CONSTRAINT "urine_smells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "urine_clarities" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "animal_type_id" UUID NOT NULL,

    CONSTRAINT "urine_clarities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "urine_consistencies" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "animal_type_id" UUID NOT NULL,

    CONSTRAINT "urine_consistencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feces_analyses" (
    "id" UUID NOT NULL,
    "animal_id" UUID,
    "feces_color_id" UUID,
    "feces_smell_id" UUID,
    "feces_consistency_id" UUID,
    "feces_form_id" UUID,
    "amount" DOUBLE PRECISION,
    "undigested_food" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feces_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feces_colors" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "animal_type_id" UUID NOT NULL,

    CONSTRAINT "feces_colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feces_smells" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "animal_type_id" UUID NOT NULL,

    CONSTRAINT "feces_smells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feces_consistencies" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "animal_type_id" UUID NOT NULL,

    CONSTRAINT "feces_consistencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feces_forms" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "animal_type_id" UUID NOT NULL,

    CONSTRAINT "feces_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mucosa_analyses" (
    "id" UUID NOT NULL,
    "mucosa_type" "MucosaType" NOT NULL,
    "animal_id" UUID,
    "mucosa_appearance_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mucosa_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mucosa_appearances" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "mucosa_type" "MucosaType" NOT NULL,
    "animal_type_id" UUID NOT NULL,

    CONSTRAINT "mucosa_appearances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animals" (
    "id" UUID NOT NULL,
    "arrival_date" TIMESTAMP(3) NOT NULL,
    "age" SMALLINT NOT NULL,
    "sex" "AnimalSex" NOT NULL DEFAULT 'UNKNOWN',
    "farmer_id" UUID NOT NULL,
    "animal_type_id" UUID NOT NULL,
    "animal_breed_id" UUID NOT NULL,
    "color_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal_types" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "parent_id" UUID,

    CONSTRAINT "animal_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal_breeds" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,

    CONSTRAINT "animal_breeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal_colors" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(50) NOT NULL,
    "name_uz" VARCHAR(50) NOT NULL,

    CONSTRAINT "animal_colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" SERIAL NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "region_id" INTEGER NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vet_stations" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "district_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vet_stations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diseases" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(100) NOT NULL,
    "name_uz" VARCHAR(100) NOT NULL,
    "type_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diseases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disease_types" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(100) NOT NULL,
    "name_uz" VARCHAR(100) NOT NULL,
    "parent_id" UUID,

    CONSTRAINT "disease_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prophylactic_records" (
    "id" UUID NOT NULL,
    "type" "ProphylaxisType" NOT NULL,
    "animal_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "detail_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prophylactic_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prophylactic_items" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "type" "ProphylaxisType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prophylactic_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prophylactic_details" (
    "id" UUID NOT NULL,
    "name_ru" VARCHAR(255) NOT NULL,
    "name_uz" VARCHAR(255) NOT NULL,
    "item_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prophylactic_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnimalToDisease" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AnimalToDisease_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_district_id_idx" ON "users"("district_id");

-- CreateIndex
CREATE UNIQUE INDEX "veterinarians_license_number_key" ON "veterinarians"("license_number");

-- CreateIndex
CREATE INDEX "veterinarians_license_number_idx" ON "veterinarians"("license_number");

-- CreateIndex
CREATE INDEX "farmers_veterinarian_id_idx" ON "farmers"("veterinarian_id");

-- CreateIndex
CREATE INDEX "animals_farmer_id_idx" ON "animals"("farmer_id");

-- CreateIndex
CREATE INDEX "animals_animal_type_id_idx" ON "animals"("animal_type_id");

-- CreateIndex
CREATE INDEX "animals_animal_breed_id_idx" ON "animals"("animal_breed_id");

-- CreateIndex
CREATE INDEX "animals_sex_idx" ON "animals"("sex");

-- CreateIndex
CREATE UNIQUE INDEX "animal_types_name_ru_key" ON "animal_types"("name_ru");

-- CreateIndex
CREATE UNIQUE INDEX "animal_types_name_uz_key" ON "animal_types"("name_uz");

-- CreateIndex
CREATE INDEX "animal_types_parent_id_idx" ON "animal_types"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "regions_name_ru_key" ON "regions"("name_ru");

-- CreateIndex
CREATE UNIQUE INDEX "regions_name_uz_key" ON "regions"("name_uz");

-- CreateIndex
CREATE INDEX "districts_region_id_idx" ON "districts"("region_id");

-- CreateIndex
CREATE INDEX "vet_stations_district_id_idx" ON "vet_stations"("district_id");

-- CreateIndex
CREATE INDEX "diseases_type_id_idx" ON "diseases"("type_id");

-- CreateIndex
CREATE INDEX "prophylactic_records_animal_id_idx" ON "prophylactic_records"("animal_id");

-- CreateIndex
CREATE INDEX "prophylactic_records_type_idx" ON "prophylactic_records"("type");

-- CreateIndex
CREATE INDEX "prophylactic_items_type_idx" ON "prophylactic_items"("type");

-- CreateIndex
CREATE INDEX "prophylactic_details_item_id_idx" ON "prophylactic_details"("item_id");

-- CreateIndex
CREATE INDEX "_AnimalToDisease_B_index" ON "_AnimalToDisease"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veterinarians" ADD CONSTRAINT "veterinarians_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmers" ADD CONSTRAINT "farmers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmers" ADD CONSTRAINT "farmers_veterinarian_id_fkey" FOREIGN KEY ("veterinarian_id") REFERENCES "veterinarians"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_analyses" ADD CONSTRAINT "blood_analyses_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urine_analyses" ADD CONSTRAINT "urine_analyses_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urine_analyses" ADD CONSTRAINT "urine_analyses_urine_color_id_fkey" FOREIGN KEY ("urine_color_id") REFERENCES "urine_colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urine_analyses" ADD CONSTRAINT "urine_analyses_urine_clarity_id_fkey" FOREIGN KEY ("urine_clarity_id") REFERENCES "urine_clarities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urine_analyses" ADD CONSTRAINT "urine_analyses_urine_consistency_id_fkey" FOREIGN KEY ("urine_consistency_id") REFERENCES "urine_consistencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urine_analyses" ADD CONSTRAINT "urine_analyses_urine_smell_id_fkey" FOREIGN KEY ("urine_smell_id") REFERENCES "urine_smells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urine_colors" ADD CONSTRAINT "urine_colors_animal_type_id_fkey" FOREIGN KEY ("animal_type_id") REFERENCES "animal_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urine_smells" ADD CONSTRAINT "urine_smells_animal_type_id_fkey" FOREIGN KEY ("animal_type_id") REFERENCES "animal_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urine_clarities" ADD CONSTRAINT "urine_clarities_animal_type_id_fkey" FOREIGN KEY ("animal_type_id") REFERENCES "animal_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "urine_consistencies" ADD CONSTRAINT "urine_consistencies_animal_type_id_fkey" FOREIGN KEY ("animal_type_id") REFERENCES "animal_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feces_analyses" ADD CONSTRAINT "feces_analyses_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feces_analyses" ADD CONSTRAINT "feces_analyses_feces_color_id_fkey" FOREIGN KEY ("feces_color_id") REFERENCES "feces_colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feces_analyses" ADD CONSTRAINT "feces_analyses_feces_smell_id_fkey" FOREIGN KEY ("feces_smell_id") REFERENCES "feces_smells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feces_analyses" ADD CONSTRAINT "feces_analyses_feces_consistency_id_fkey" FOREIGN KEY ("feces_consistency_id") REFERENCES "feces_consistencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feces_analyses" ADD CONSTRAINT "feces_analyses_feces_form_id_fkey" FOREIGN KEY ("feces_form_id") REFERENCES "feces_forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feces_colors" ADD CONSTRAINT "feces_colors_animal_type_id_fkey" FOREIGN KEY ("animal_type_id") REFERENCES "animal_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feces_smells" ADD CONSTRAINT "feces_smells_animal_type_id_fkey" FOREIGN KEY ("animal_type_id") REFERENCES "animal_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feces_consistencies" ADD CONSTRAINT "feces_consistencies_animal_type_id_fkey" FOREIGN KEY ("animal_type_id") REFERENCES "animal_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feces_forms" ADD CONSTRAINT "feces_forms_animal_type_id_fkey" FOREIGN KEY ("animal_type_id") REFERENCES "animal_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mucosa_analyses" ADD CONSTRAINT "mucosa_analyses_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mucosa_analyses" ADD CONSTRAINT "mucosa_analyses_mucosa_appearance_id_fkey" FOREIGN KEY ("mucosa_appearance_id") REFERENCES "mucosa_appearances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mucosa_appearances" ADD CONSTRAINT "mucosa_appearances_animal_type_id_fkey" FOREIGN KEY ("animal_type_id") REFERENCES "animal_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "farmers"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_animal_type_id_fkey" FOREIGN KEY ("animal_type_id") REFERENCES "animal_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_animal_breed_id_fkey" FOREIGN KEY ("animal_breed_id") REFERENCES "animal_breeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "animal_colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animal_types" ADD CONSTRAINT "animal_types_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "animal_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vet_stations" ADD CONSTRAINT "vet_stations_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diseases" ADD CONSTRAINT "diseases_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "disease_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disease_types" ADD CONSTRAINT "disease_types_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "disease_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prophylactic_records" ADD CONSTRAINT "prophylactic_records_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prophylactic_records" ADD CONSTRAINT "prophylactic_records_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "prophylactic_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prophylactic_records" ADD CONSTRAINT "prophylactic_records_detail_id_fkey" FOREIGN KEY ("detail_id") REFERENCES "prophylactic_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prophylactic_details" ADD CONSTRAINT "prophylactic_details_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "prophylactic_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimalToDisease" ADD CONSTRAINT "_AnimalToDisease_A_fkey" FOREIGN KEY ("A") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimalToDisease" ADD CONSTRAINT "_AnimalToDisease_B_fkey" FOREIGN KEY ("B") REFERENCES "diseases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

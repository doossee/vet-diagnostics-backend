-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('DRAFT', 'READY', 'SUBMITTED');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('NEW', 'ACKNOWLEDGED', 'RESOLVED');

-- CreateTable: MedicalSession
CREATE TABLE "medical_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "animal_id" UUID NOT NULL,
    "veterinarian_id" UUID,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SessionStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "medical_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medical_sessions_animal_id_idx" ON "medical_sessions"("animal_id");

-- CreateIndex
CREATE INDEX "medical_sessions_veterinarian_id_idx" ON "medical_sessions"("veterinarian_id");

-- CreateIndex
CREATE INDEX "medical_sessions_status_idx" ON "medical_sessions"("status");

-- CreateIndex
CREATE INDEX "medical_sessions_date_idx" ON "medical_sessions"("date");

-- AddForeignKey
ALTER TABLE "medical_sessions" ADD CONSTRAINT "medical_sessions_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_sessions" ADD CONSTRAINT "medical_sessions_veterinarian_id_fkey" FOREIGN KEY ("veterinarian_id") REFERENCES "veterinarians"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable: Prediction
CREATE TABLE "predictions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "input_vector" JSONB NOT NULL,
    "raw_output" JSONB NOT NULL,
    "model_version" VARCHAR(50),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "predictions_session_id_key" ON "predictions"("session_id");

-- CreateIndex
CREATE INDEX "predictions_session_id_idx" ON "predictions"("session_id");

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "medical_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: Feedback
CREATE TABLE "feedbacks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prediction_id" UUID NOT NULL,
    "veterinarian_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "suggested_disease_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feedbacks_prediction_id_idx" ON "feedbacks"("prediction_id");

-- CreateIndex
CREATE INDEX "feedbacks_veterinarian_id_idx" ON "feedbacks"("veterinarian_id");

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_prediction_id_fkey" FOREIGN KEY ("prediction_id") REFERENCES "predictions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_veterinarian_id_fkey" FOREIGN KEY ("veterinarian_id") REFERENCES "veterinarians"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_suggested_disease_id_fkey" FOREIGN KEY ("suggested_disease_id") REFERENCES "diseases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add session_id columns to exam tables
ALTER TABLE "clinical_analyses" ADD COLUMN "session_id" UUID;
CREATE UNIQUE INDEX "clinical_analyses_session_id_key" ON "clinical_analyses"("session_id");
ALTER TABLE "clinical_analyses" ADD CONSTRAINT "clinical_analyses_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "medical_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "blood_analyses" ADD COLUMN "session_id" UUID;
CREATE UNIQUE INDEX "blood_analyses_session_id_key" ON "blood_analyses"("session_id");
ALTER TABLE "blood_analyses" ADD CONSTRAINT "blood_analyses_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "medical_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "urine_analyses" ADD COLUMN "session_id" UUID;
CREATE UNIQUE INDEX "urine_analyses_session_id_key" ON "urine_analyses"("session_id");
ALTER TABLE "urine_analyses" ADD CONSTRAINT "urine_analyses_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "medical_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "feces_analyses" ADD COLUMN "session_id" UUID;
CREATE UNIQUE INDEX "feces_analyses_session_id_key" ON "feces_analyses"("session_id");
ALTER TABLE "feces_analyses" ADD CONSTRAINT "feces_analyses_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "medical_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "mucosa_analyses" ADD COLUMN "session_id" UUID;
CREATE INDEX "mucosa_analyses_session_id_idx" ON "mucosa_analyses"("session_id");
ALTER TABLE "mucosa_analyses" ADD CONSTRAINT "mucosa_analyses_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "medical_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: ReferenceRange
CREATE TABLE "reference_ranges" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "animal_type_id" UUID NOT NULL,
    "parameter" VARCHAR(100) NOT NULL,
    "min_value" DOUBLE PRECISION NOT NULL,
    "max_value" DOUBLE PRECISION NOT NULL,
    "unit" VARCHAR(50),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "reference_ranges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reference_ranges_animal_type_id_idx" ON "reference_ranges"("animal_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "reference_ranges_animal_type_id_parameter_key" ON "reference_ranges"("animal_type_id", "parameter");

-- CreateTable: AnomalyAlert
CREATE TABLE "anomaly_alerts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "animal_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "parameter" VARCHAR(100) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "min_norm" DOUBLE PRECISION NOT NULL,
    "max_norm" DOUBLE PRECISION NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'LOW',
    "status" "AlertStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "anomaly_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "anomaly_alerts_animal_id_idx" ON "anomaly_alerts"("animal_id");

-- CreateIndex
CREATE INDEX "anomaly_alerts_session_id_idx" ON "anomaly_alerts"("session_id");

-- CreateIndex
CREATE INDEX "anomaly_alerts_severity_idx" ON "anomaly_alerts"("severity");

-- CreateIndex
CREATE INDEX "anomaly_alerts_status_idx" ON "anomaly_alerts"("status");

-- AddForeignKey
ALTER TABLE "reference_ranges" ADD CONSTRAINT "reference_ranges_animal_type_id_fkey" FOREIGN KEY ("animal_type_id") REFERENCES "animal_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anomaly_alerts" ADD CONSTRAINT "anomaly_alerts_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anomaly_alerts" ADD CONSTRAINT "anomaly_alerts_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "medical_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('NEW', 'ACKNOWLEDGED', 'RESOLVED');

-- CreateTable
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

-- CreateTable
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
CREATE INDEX "reference_ranges_animal_type_id_idx" ON "reference_ranges"("animal_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "reference_ranges_animal_type_id_parameter_key" ON "reference_ranges"("animal_type_id", "parameter");

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

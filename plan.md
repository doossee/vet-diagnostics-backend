# Implementation Plan: Anomaly Detection & Early Warning System

## Overview

Add anomaly detection module with: unified prediction endpoint (4 cattle types, 85 features → 116 diseases), trend tracking, anomaly detection against reference ranges, and early warning alerts.

## 1. Prisma Schema Changes (`prisma/schema/`)

### 1a. New file: `anomaly.prisma`

- **`ReferenceRange`** model — stores min/max normal ranges per parameter per animal type:
  - `id`, `animalTypeId` (FK → AnimalType), `parameter` (String, e.g. "pulse", "hemoglobin"), `minValue Float`, `maxValue Float`, `unit String?`, `@@unique([animalTypeId, parameter])`

- **`AnomalyAlert`** model — stores detected anomalies:
  - `id`, `animalId` (FK → Animal), `sessionId` (FK → MedicalSession), `parameter` (String), `value Float`, `minNorm Float`, `maxNorm Float`, `severity` (enum: LOW, MEDIUM, HIGH, CRITICAL), `status` (enum: NEW, ACKNOWLEDGED, RESOLVED), `createdAt`, `updatedAt`

- **`AlertSeverity`** enum: LOW, MEDIUM, HIGH, CRITICAL
- **`AlertStatus`** enum: NEW, ACKNOWLEDGED, RESOLVED

### 1b. Update `session.prisma`

- Add `anomalyAlerts AnomalyAlert[]` relation to `MedicalSession`

### 1c. Update `inventory.prisma`

- Add `referenceRanges ReferenceRange[]` relation to `AnimalType`
- Add `anomalyAlerts AnomalyAlert[]` relation to `Animal`

### 1d. Run `prisma migrate`

## 2. Anomaly Detection Module (`src/modules/diagnostics/anomaly-detection/`)

### 2a. `anomaly-detection.module.ts`
- Imports PrismaService, ConfigModule
- Providers: AnomalyDetectionService, ReferenceRangeService
- Controller: AnomalyDetectionController
- Exports: AnomalyDetectionService

### 2b. DTOs

- **`predict.dto.ts`** — `PredictDto`:
  - `animalTypeId: string` (UUID, required) — one of 4 cattle types
  - All 85 feature fields matching the document (pulse, respiration, temperature, erythrocytes... through lymphMobility)
  - Each field is `@IsOptional() @IsNumber()` Float

- **`predict-query.dto.ts`** — `PredictQueryDto`:
  - `animalType: string` — query param to identify cattle type

- **`anomaly-query.dto.ts`** — `AnomalyQueryDto extends BaseQueryParamsDto`:
  - `animalId?: string`, `sessionId?: string`, `severity?: AlertSeverity`, `status?: AlertStatus`

- **`update-alert.dto.ts`** — `UpdateAlertDto`:
  - `status: AlertStatus`

- **`trend-query.dto.ts`** — `TrendQueryDto`:
  - `animalId: string` (required), `parameter: string` (required), `from?: string` (ISO date), `to?: string` (ISO date), `limit?: number`

### 2c. `reference-range.service.ts`
- CRUD for reference ranges
- `findByAnimalType(animalTypeId)` — get all ranges for a type
- `checkAnomalies(animalTypeId, values: Record<string, number>)` — compare values against ranges, return anomaly list with severity calculation:
  - Within range → OK
  - 0-20% outside → LOW
  - 20-50% outside → MEDIUM
  - 50-100% outside → HIGH
  - >100% outside → CRITICAL

### 2d. `anomaly-detection.service.ts`
- **`predict(animalTypeId, features)`** — single prediction endpoint:
  1. Build numeric input vector from 85 features
  2. Call external ML service (`PREDICT_API_URI`) with `animalType` query param
  3. Check all numeric values against ReferenceRange for this animalType
  4. Create AnomalyAlert records for any deviations
  5. Return: `{ predictions: Disease[], anomalies: AnomalyAlert[], severity: 'OK' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }`

- **`getAnimalTrend(animalId, parameter, from?, to?)`** — trend tracking:
  1. Query MedicalSession + related exams for this animal, ordered by date
  2. Extract the requested parameter values over time
  3. Return: `{ parameter, unit, dataPoints: { date, value }[], trend: 'stable' | 'increasing' | 'decreasing', changePercent }`

- **`getAlerts(query)`** — paginated list of anomaly alerts with filters
- **`updateAlert(id, status)`** — acknowledge/resolve alert
- **`getAnimalHealthSummary(animalId)`** — aggregate:
  1. Latest session results
  2. Active (unresolved) alerts count by severity
  3. Recent trend direction for key parameters

### 2e. `anomaly-detection.controller.ts`

Endpoints:
- `POST /anomaly-detection/predict?animalType=<uuid>` — unified prediction + anomaly check
- `GET /anomaly-detection/trends` — trend data for an animal+parameter
- `GET /anomaly-detection/alerts` — paginated alerts list
- `PATCH /anomaly-detection/alerts/:id` — update alert status
- `GET /anomaly-detection/animals/:animalId/health-summary` — health summary

### 2f. Entities (response schemas)
- `PredictionResultEntity` — prediction + anomalies + overall severity
- `TrendEntity` — trend data points + direction
- `AnomalyAlertEntity` — alert details
- `HealthSummaryEntity` — summary response

### 2g. Reference Range management endpoints
- `POST /reference-ranges` — create (admin only)
- `GET /reference-ranges?animalTypeId=<uuid>` — list by animal type
- `PATCH /reference-ranges/:id` — update
- `DELETE /reference-ranges/:id` — delete

## 3. Wire Into Diagnostics Module

- Import `AnomalyDetectionModule` into `DiagnosticsModule`

## 4. Unit Tests

- `anomaly-detection.service.spec.ts` — test prediction flow, anomaly detection logic, trend calculation
- `reference-range.service.spec.ts` — test range checking and severity calculation

## 5. Files to Create/Modify

**New files (~15):**
- `prisma/schema/anomaly.prisma`
- `src/modules/diagnostics/anomaly-detection/anomaly-detection.module.ts`
- `src/modules/diagnostics/anomaly-detection/anomaly-detection.controller.ts`
- `src/modules/diagnostics/anomaly-detection/anomaly-detection.service.ts`
- `src/modules/diagnostics/anomaly-detection/reference-range.service.ts`
- `src/modules/diagnostics/anomaly-detection/dto/predict.dto.ts`
- `src/modules/diagnostics/anomaly-detection/dto/anomaly-query.dto.ts`
- `src/modules/diagnostics/anomaly-detection/dto/trend-query.dto.ts`
- `src/modules/diagnostics/anomaly-detection/dto/update-alert.dto.ts`
- `src/modules/diagnostics/anomaly-detection/dto/index.ts`
- `src/modules/diagnostics/anomaly-detection/entities/prediction-result.entity.ts`
- `src/modules/diagnostics/anomaly-detection/entities/trend.entity.ts`
- `src/modules/diagnostics/anomaly-detection/entities/anomaly-alert.entity.ts`
- `src/modules/diagnostics/anomaly-detection/entities/health-summary.entity.ts`
- `src/modules/diagnostics/anomaly-detection/entities/index.ts`
- `src/modules/diagnostics/anomaly-detection/anomaly-detection.service.spec.ts`

**Modified files (~3):**
- `prisma/schema/session.prisma` — add AnomalyAlert relation
- `prisma/schema/inventory.prisma` — add relations
- `src/modules/diagnostics/diagnostics.module.ts` — import new module

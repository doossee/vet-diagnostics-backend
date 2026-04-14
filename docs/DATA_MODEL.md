# Data Model

The database schema is split across 11 Prisma schema files, one per domain, composed by `prisma/schema/schema.prisma`. All models use PostgreSQL. The Prisma client is generated to `src/generated/prisma/`.

---

## Enums

```prisma
enum UserRole {
  SUPER_ADMIN
  ADMIN
  VETERINARIAN
  FARMER
}

enum UserGender {
  MALE
  FEMALE
}

enum SessionStatus {
  DRAFT      // Being filled in
  READY      // All exams complete, not yet submitted
  SUBMITTED  // ML prediction received
}

enum ProphylaxisType {
  VACCINE
  IMMUNIZATION
  DEWORMING
}

enum AlertSeverity {
  LOW       // 0–20% outside normal range
  MEDIUM    // 20–50% outside normal range
  HIGH      // 50–100% outside normal range
  CRITICAL  // >100% outside normal range
}

enum AlertStatus {
  NEW
  ACKNOWLEDGED
  RESOLVED
}
```

---

## Domain: Authentication (`auth.prisma`)

### User
The central identity record. One User can have at most one `VetProfile` or `FarmerProfile`.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `username` | String | Unique |
| `password` | String | bcrypt hash |
| `firstName` | String | |
| `lastName` | String | |
| `email` | String? | Unique |
| `phone` | String? | Unique |
| `avatar` | String? | Relative path |
| `gender` | UserGender? | MALE \| FEMALE |
| `birthDate` | DateTime? | |
| `address` | String? | |
| `role` | UserRole | SUPER_ADMIN \| ADMIN \| VETERINARIAN \| FARMER |
| `districtId` | UUID? | FK → District |
| `refreshTokenHash` | String? | SHA256 of current refresh token |
| `tokenExpiresAt` | DateTime? | Refresh token expiry |
| `isActive` | Boolean | Default: true |
| `deletedAt` | DateTime? | Soft delete |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

**Relations:** `veterinarianProfile?`, `farmerProfile?`, `district?`

---

### VetProfile
Extended profile for veterinarians. `id` equals the parent `User.id` (1:1).

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK = User.id (cascade delete) |
| `licenseNumber` | String? | Unique |
| `specialization` | String | |
| `experience` | Int | Years |

**Relations:** `user`, `farmers[]` (FarmerProfile), `medicalSessions[]`, `feedbacks[]`

---

### FarmerProfile
Extended profile for farmers. `id` equals the parent `User.id`.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK = User.id (cascade delete) |
| `veterinarianId` | UUID? | FK → VetProfile |
| `farmName` | String | |
| `farmSize` | Float | Hectares |

**Relations:** `user`, `veterinarian?`, `animals[]`

---

## Domain: Inventory (`inventory.prisma`)

### Animal
The core entity. Every exam and session links back here.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `arrivalDate` | DateTime | |
| `age` | SmallInt | Years |
| `animalNameCode` | String | Unique visible identifier (e.g. "COW-001") |
| `sexId` | UUID? | FK → AnimalSex |
| `farmerId` | UUID? | FK → FarmerProfile |
| `animalTypeId` | UUID | FK → AnimalType |
| `animalBreedId` | UUID | FK → Breed |
| `animalColorId` | UUID | FK → Color |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

**Relations:** `sex?`, `farmer?`, `animalType`, `animalBreed`, `animalColor`, `medicalSessions[]`, `anomalyAlerts[]`, `vaccines[]`, `diseases[]`

---

### AnimalType
Hierarchical species classification using a self-referential parent/children relation.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `name` | Json | `{ ru: string, uz: string }` |
| `parentId` | UUID? | FK → AnimalType (self) |

**Relations:** `parent?`, `children[]`, `animals[]`, lookup tables (urineColors, fecesColors, mucosaAppearances, referenceRanges)

---

### Breed / Color
Simple bilingual lookup tables.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `name` | Json | `{ ru, uz }` |

---

### AnimalSex
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `name` | Json | `{ ru, uz }` |
| `numericValue` | Int | Unique — used as ML feature |

---

## Domain: Medical (`medical.prisma`)

### Disease
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `name` | Json | `{ ru, uz }` |
| `diseaseCategoryId` | UUID | FK → DiseaseCategory |

**Relations:** `category`, `animals[]`, `feedbacks[]`

---

### DiseaseCategory
Hierarchical (self-referential).

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `name` | Json | `{ ru, uz }` |
| `parentId` | UUID? | FK → DiseaseCategory |

---

### Prophylaxis
A single prophylaxis event (vaccine dose, deworming, etc.).

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `type` | ProphylaxisType | VACCINE \| IMMUNIZATION \| DEWORMING |
| `animalId` | UUID | FK → Animal |
| `itemId` | UUID | FK → ProphylaxisItem |
| `detailId` | UUID? | FK → ProphylaxisDetail |
| `date` | DateTime | When it was administered |

---

### ProphylaxisItem
Catalog of drugs/vaccines.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `name` | Json | `{ ru, uz }` |
| `type` | ProphylaxisType | What kind of treatment |

**Relations:** `records[]`, `details[]`

---

### ProphylaxisDetail
Sub-variants of an item (e.g. vaccine strain).

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `name` | Json | `{ ru, uz }` |
| `itemId` | UUID | FK → ProphylaxisItem |

---

## Domain: Sessions & Predictions (`session.prisma`)

### MedicalSession
The container that groups all five exam types from a single veterinary visit.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `animalId` | UUID | FK → Animal |
| `veterinarianId` | UUID? | FK → VetProfile |
| `date` | DateTime | Visit date/time |
| `status` | SessionStatus | DRAFT → READY → SUBMITTED |
| `notes` | String? | Free text |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

**Relations:** `animal`, `veterinarian?`, `clinicalExam?`, `bloodExam?`, `urineExam?`, `fecesExam?`, `mucosaExams[]`, `prediction?`, `anomalyAlerts[]`

---

### Prediction
The ML model's output for a submitted session. One per session.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `sessionId` | UUID | Unique FK → MedicalSession |
| `inputVector` | Json | Ordered 88-element numeric array sent to ML |
| `rawOutput` | Json | Full response from ML service |
| `modelVersion` | String? | From `PREDICT_MODEL_VERSION` env var |
| `createdAt` | DateTime | Auto |

**Relations:** `session`, `feedbacks[]`

---

### Feedback
Veterinarian's rating of an AI prediction. Powers the retraining loop.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `predictionId` | UUID | FK → Prediction |
| `veterinarianId` | UUID | FK → VetProfile |
| `rating` | Int | 1–5 |
| `comment` | String? | |
| `suggestedDiseaseId` | UUID? | FK → Disease (vet's correction) |
| `createdAt` | DateTime | Auto |

---

## Domain: Clinical Exam (`clinical-exam.prisma`)

### ClinicalExam
The physical examination. Has 5 numeric vitals and 23 foreign keys to categorical lookup tables.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `animalId` | UUID | FK → Animal |
| `sessionId` | UUID? | FK → MedicalSession |
| **Vitals** | | |
| `pulse` | Int? | bpm (validated 10–300) |
| `temperature` | Float? | °C (validated 30–45) |
| `respiratoryRate` | Float? | breaths/min (validated 1–150) |
| `rumination` | Int? | contractions/2min (validated 0–30) |
| `rumenInfusoriaCount` | Float? | count (validated 0–1,000,000) |
| **Habitus FKs** | | |
| `bodyTypeId` | UUID? | FK → BodyType |
| `obesityId` | UUID? | FK → ObesityType |
| `bodyPositionId` | UUID? | FK → BodyPosition |
| `constitutionId` | UUID? | FK → Constitution |
| `temperamentId` | UUID? | FK → Temperament |
| **Skin Cover FKs** | | |
| `woolId`, `downId`, `hairId`, `feathersId` | UUID? | Respective lookup tables |
| **Skin FKs** | | |
| `skinColorId`, `skinHumidityId`, `skinSmellId`, `skinTempId` | UUID? | |
| `skinSurfaceId`, `skinElasticityId`, `skinSensitivityId`, `skinPainId` | UUID? | |
| **Rumen FK** | | |
| `rumenFluidStateId` | UUID? | FK → RumenFluidState |
| **Lymph FKs** | | |
| `lymphSizeId`, `lymphShapeId`, `lymphSurfaceId`, `lymphConsistencyId` | UUID? | |
| `lymphTempId`, `lymphPainId`, `lymphMobilityId` | UUID? | |

**Clinical Lookup Tables** (each has `id`, `name: Json`, `numericValue: Int @unique`):
- `BodyType`, `ObesityType`, `BodyPosition`, `Constitution`, `Temperament`
- `WoolType`, `DownType`, `HairType`, `FeatherType`
- `SkinColor`, `SkinHumidity`, `SkinSmell`, `SkinTemp`, `SkinSurface`, `SkinElasticity`, `SkinSensitivity`, `SkinPain`
- `RumenFluidState`
- `LymphSize`, `LymphShape`, `LymphSurface`, `LymphConsistency`, `LymphTemp`, `LymphPain`, `LymphMobility`

---

## Domain: Blood Exam (`blood-exam.prisma`)

### BloodExam
40+ numeric fields. All optional.

| Group | Fields |
|---|---|
| **Morphology** | `coe`, `erythrocyteCount`, `leukocyteCount`, `thrombocyteCount`, `hemoglobin`, `glutathione`, `waterPercentage`, `dryResidue` |
| **Serum — Protein** | `totalProtein`, `albumin` |
| **Serum — Lipid** | `totalCholesterol`, lipid fractions |
| **Serum — Bilirubin** | `totalBilirubin`, `directBilirubin` |
| **Serum — Metabolites** | `glucose`, `alkalineReserve`, `ketoneBodies`, `urea` |
| **Serum — Minerals** | `totalCalcium`, `organicPhosphorus` |
| **Trace Elements** | `copper`, `cobalt`, `manganese`, `zinc` |
| **Other** | `conclusion` (Text) |

---

## Domain: Urine Exam (`urine-exam.prisma`)

### UrineExam

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `animalId`, `sessionId` | UUID | FKs |
| `ph` | Float? | |
| `amount` | Float? | mL |
| `acetone` | Float? | |
| `protein` | Float? | |
| `bilirubin` | Float? | |
| `urobilinogen` | Float? | |
| `sugar` | Float? | |
| `leukocytes` | Float? | |
| `epithelium` | Float? | |
| `microbialBodies` | Float? | |
| `erythrocytes` | Float? | |
| `saltCrystals` | Float? | |
| `urineColorId` | UUID? | FK → UrineColor |
| `urineSmellId` | UUID? | FK → UrineSmell |
| `urineClarityId` | UUID? | FK → UrineClarity |
| `urineConsistencyId` | UUID? | FK → UrineConsistency |

**Lookup Tables** (each has `id`, `name: Json`, `numericValue: Int`, `animalTypeId: UUID`):
- `UrineColor`, `UrineSmell`, `UrineClarity`, `UrineConsistency`

---

## Domain: Feces Exam (`feces-exam.prisma`)

### FecesExam

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `animalId`, `sessionId` | UUID | FKs |
| `amount` | Float? | grams |
| `undigestedFood` | Float? | % |
| `fecesColorId` | UUID? | |
| `fecesSmellId` | UUID? | |
| `fecesConsistencyId` | UUID? | |
| `fecesFormId` | UUID? | |

**Lookup Tables:** `FecesColor`, `FecesSmell`, `FecesConsistency`, `FecesForm`

---

## Domain: Mucosa Exam (`mucosa-exam.prisma`)

### MucosaExam
One record per mucosa type per session (up to four).

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `animalId`, `sessionId` | UUID | FKs |
| `mucosaTypeId` | UUID | FK → MucosaType |
| `mucosaAppearanceId` | UUID | FK → MucosaAppearance |

### MucosaType
| `numericValue` | Meaning |
|---|---|
| 0 | Oral |
| 1 | Nasal |
| 2 | Ocular |
| 3 | Vaginal |

### MucosaAppearance
Has `id`, `name: Json`, `numericValue: Int`, `animalTypeId: UUID`.

---

## Domain: Anomaly Detection (`anomaly.prisma`)

### ReferenceRange
Defines the normal physiological range for a single parameter per animal type.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `animalTypeId` | UUID | FK → AnimalType |
| `parameter` | String | e.g. `"pulse"`, `"hemoglobin"` |
| `minValue` | Float | |
| `maxValue` | Float | |
| `unit` | String | e.g. `"bpm"`, `"g/l"` |
| `isActive` | Boolean | Default: true |

**Unique constraint:** `(animalTypeId, parameter)` — one range per parameter per species.

---

### AnomalyAlert
Created when a measured value falls outside its reference range.

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `animalId` | UUID | FK → Animal |
| `sessionId` | UUID | FK → MedicalSession |
| `parameter` | String | Which parameter triggered the alert |
| `value` | Float | The actual measured value |
| `minNorm` | Float | Normal range min |
| `maxNorm` | Float | Normal range max |
| `severity` | AlertSeverity | LOW / MEDIUM / HIGH / CRITICAL |
| `status` | AlertStatus | NEW → ACKNOWLEDGED → RESOLVED |
| `createdAt` | DateTime | Auto |

**Severity calculation:**
```
range_span = maxNorm - minNorm
deviation = abs(value - closest_boundary)
severity_percent = (deviation / range_span) * 100

0–20%    → LOW
20–50%   → MEDIUM
50–100%  → HIGH
>100%    → CRITICAL
```

---

## Domain: Management (`management.prisma`)

### Region
| Field | Type | Notes |
|---|---|---|
| `id` | Int | Auto-increment PK |
| `name` | Json | `{ ru, uz }` |

### District
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `name` | Json | `{ ru, uz }` |
| `regionId` | Int | FK → Region |

### VetStation
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `name` | Json | `{ ru, uz }` |
| `districtId` | UUID | FK → District |

---

## Key Design Conventions

### Bilingual Names
Every entity that the user sees by name uses:
```prisma
name Json  // { ru: string, uz: string }
```

### ML Numeric Values
Every categorical lookup table used in exams has:
```prisma
numericValue Int @unique
```
This value is extracted directly when building the ML input vector — no application-layer encoding is needed.

### Soft Deletes
Only `User` has a soft delete (`deletedAt`). All other models use hard deletes. The `isActive` flag on `User` is used separately to suspend accounts without deleting them.

### Hierarchical Lookups
`AnimalType` and `DiseaseCategory` both support arbitrary depth trees via a self-referential `parentId` field. Children are loaded with `include: { children: true }`.

### Modular Schema Composition
The master `prisma/schema/schema.prisma` uses Prisma's multi-file schema feature to include all domain-specific files:
```prisma
// prisma/schema/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
// domain files are included automatically by the schema directory
```

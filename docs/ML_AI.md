# ML / AI Integration

## Overview

The system integrates with an external ML prediction service via HTTP. The backend is responsible for:
1. Collecting all exam data for a session
2. Building a fixed-length numeric feature vector (88 features) from that data
3. Sending the vector to the ML service
4. Storing the raw prediction response
5. Running anomaly detection against reference ranges
6. Collecting veterinarian feedback for the model retraining loop

The ML model itself is external — the backend treats it as a black box at `PREDICT_API_URI`.

---

## Session Submission Flow

```
POST /medical-sessions/:id/submit
         │
         ▼
MedicalSessionService.submit(id)
         │
         ├── 1. Load session with all exam data (single DB query with full includes)
         │
         ├── 2. Validate: clinicalExam AND bloodExam must both exist
         │       → 400 if missing
         │
         ├── 3. Build inputVector (see Feature Vector section)
         │
         ├── 4. Convert to ordered numeric array
         │       numericArray = Object.values(inputVector).map(v => v === null ? null : Number(v))
         │
         ├── 5. POST to PREDICT_API_URI
         │       { params: number[] }
         │       (axios, 1 attempt, no retry)
         │
         ├── 6. On ML error:
         │       - HTTP error response  → 400 "AI prediction service returned error: {status}"
         │       - Network error        → 400 "AI prediction service is unavailable"
         │       - Other error          → 400 "Failed to get prediction from AI service"
         │
         └── 7. Atomically:
                 ├── Create Prediction { inputVector, rawOutput, modelVersion }
                 └── Update MedicalSession.status = SUBMITTED
```

---

## The 88-Feature Input Vector

Features are extracted from six sources: animal sex, clinical exam, blood exam, urine exam, feces exam, and mucosa exams.

Categorical features come from lookup tables that each carry a `numericValue: Int @unique` field. This value is used directly — no one-hot encoding or mapping step is needed.

Missing values are represented as `null` in the vector.

### Feature Order and Source

| # | Feature Key | Source | Notes |
|---|---|---|---|
| 1 | `sex` | `animal.sex.numericValue` | AnimalSex lookup |
| 2 | `temperature` | `clinicalExam.temperature` | Float, °C |
| 3 | `pulse` | `clinicalExam.pulse` | Int, bpm |
| 4 | `respiratoryRate` | `clinicalExam.respiratoryRate` | Float, breaths/min |
| 5 | `rumination` | `clinicalExam.rumination` | Int, contractions/2min |
| 6 | `rumenInfusoriaCount` | `clinicalExam.rumenInfusoriaCount` | Float |
| 7 | `bodyType` | `clinicalExam.bodyType.numericValue` | Habitus lookup |
| 8 | `obesity` | `clinicalExam.obesity.numericValue` | |
| 9 | `bodyPosition` | `clinicalExam.bodyPosition.numericValue` | |
| 10 | `constitution` | `clinicalExam.constitution.numericValue` | |
| 11 | `temperament` | `clinicalExam.temperament.numericValue` | |
| 12 | `wool` | `clinicalExam.wool.numericValue` | Skin cover |
| 13 | `down` | `clinicalExam.down.numericValue` | |
| 14 | `hair` | `clinicalExam.hair.numericValue` | |
| 15 | `feathers` | `clinicalExam.feathers.numericValue` | |
| 16 | `skinColor` | `clinicalExam.skinColor.numericValue` | Skin |
| 17 | `skinHumidity` | `clinicalExam.skinHumidity.numericValue` | |
| 18 | `skinSmell` | `clinicalExam.skinSmell.numericValue` | |
| 19 | `skinTemp` | `clinicalExam.skinTemp.numericValue` | |
| 20 | `skinSurface` | `clinicalExam.skinSurface.numericValue` | |
| 21 | `skinElasticity` | `clinicalExam.skinElasticity.numericValue` | |
| 22 | `skinSensitivity` | `clinicalExam.skinSensitivity.numericValue` | |
| 23 | `skinPain` | `clinicalExam.skinPain.numericValue` | |
| 24 | `rumenFluidState` | `clinicalExam.rumenFluidState.numericValue` | Rumen |
| 25 | `lymphSize` | `clinicalExam.lymphSize.numericValue` | Lymph nodes |
| 26 | `lymphShape` | `clinicalExam.lymphShape.numericValue` | |
| 27 | `lymphSurface` | `clinicalExam.lymphSurface.numericValue` | |
| 28 | `lymphConsistency` | `clinicalExam.lymphConsistency.numericValue` | |
| 29 | `lymphTemp` | `clinicalExam.lymphTemp.numericValue` | |
| 30 | `lymphPain` | `clinicalExam.lymphPain.numericValue` | |
| 31 | `lymphMobility` | `clinicalExam.lymphMobility.numericValue` | |
| 32 | `erythrocyteCount` | `bloodExam.erythrocyteCount` | Blood morphology |
| 33 | `leukocyteCount` | `bloodExam.leukocyteCount` | |
| 34 | `thrombocyteCount` | `bloodExam.thrombocyteCount` | |
| 35 | `hemoglobin` | `bloodExam.hemoglobin` | |
| 36 | `coe` | `bloodExam.coe` | ESR |
| 37 | `totalProtein` | `bloodExam.totalProtein` | Blood serum |
| 38 | `totalCalcium` | `bloodExam.totalCalcium` | |
| 39 | `organicPhosphorus` | `bloodExam.organicPhosphorus` | |
| 40 | `albumin` | `bloodExam.albumin` | |
| 41 | `glucose` | `bloodExam.glucose` | |
| 42 | `alkalineReserve` | `bloodExam.alkalineReserve` | |
| 43 | `ketoneBodies` | `bloodExam.ketoneBodies` | |
| 44 | `totalBilirubin` | `bloodExam.totalBilirubin` | |
| 45 | `totalCholesterol` | `bloodExam.totalCholesterol` | |
| 46 | `urea` | `bloodExam.urea` | |
| 47 | `copper` | `bloodExam.copper` | Trace elements |
| 48 | `cobalt` | `bloodExam.cobalt` | |
| 49 | `manganese` | `bloodExam.manganese` | |
| 50 | `zinc` | `bloodExam.zinc` | |
| 51 | `urinePh` | `urineExam.ph` | Urine — numeric |
| 52 | `urineAmount` | `urineExam.amount` | |
| 53 | `urineAcetone` | `urineExam.acetone` | |
| 54 | `urineProtein` | `urineExam.protein` | |
| 55 | `urineBilirubin` | `urineExam.bilirubin` | |
| 56 | `urineSugar` | `urineExam.sugar` | |
| 57 | `urineLeukocytes` | `urineExam.leukocytes` | |
| 58 | `urineErythrocytes` | `urineExam.erythrocytes` | |
| 59 | `urineColor` | `urineExam.urineColor.numericValue` | Urine — lookups |
| 60 | `urineSmell` | `urineExam.urineSmell.numericValue` | |
| 61 | `urineClarity` | `urineExam.urineClarity.numericValue` | |
| 62 | `urineConsistency` | `urineExam.urineConsistency.numericValue` | |
| 63 | `fecesAmount` | `fecesExam.amount` | Feces — numeric |
| 64 | `fecesUndigestedFood` | `fecesExam.undigestedFood` | |
| 65 | `fecesColor` | `fecesExam.fecesColor.numericValue` | Feces — lookups |
| 66 | `fecesSmell` | `fecesExam.fecesSmell.numericValue` | |
| 67 | `fecesConsistency` | `fecesExam.fecesConsistency.numericValue` | |
| 68 | `fecesForm` | `fecesExam.fecesForm.numericValue` | |
| 69 | `mucosaOral` | `mucosaExams.find(m => m.mucosaType.numericValue === 0).mucosaAppearance.numericValue` | Mucosa |
| 70 | `mucosaNasal` | `...numericValue === 1...` | |
| 71 | `mucosaOcular` | `...numericValue === 2...` | |
| 72 | `mucosaVaginal` | `...numericValue === 3...` | |

> Urine, feces, and mucosa features are `null` if the corresponding exam was not collected for this session.

---

## Direct Prediction (Without Session)

The `AnomalyDetectionService` also supports a direct prediction endpoint that does not require a pre-existing session:

```
POST /anomaly-detection/predict
{
  "animalTypeId": "uuid",
  "pulse": 80,
  "temperature": 38.5,
  ...any of the 88 features
}
```

Internally, this endpoint uses a different feature key ordering defined in the `FEATURE_KEYS` constant (88 keys in fixed ML model order). It builds the vector from the DTO directly and calls the same `PREDICT_API_URI`.

If `animalId` and `sessionId` are also provided, the endpoint persists `AnomalyAlert` records for each parameter that falls outside its reference range.

---

## Anomaly Detection

Anomaly detection runs in parallel with or independently of ML prediction.

### Reference Ranges
An admin creates reference ranges per parameter per animal type:
```json
{
  "animalTypeId": "uuid",
  "parameter": "pulse",
  "minValue": 60,
  "maxValue": 80,
  "unit": "beats/min"
}
```

### Severity Algorithm

For each measured value, the service:

1. Looks up the `ReferenceRange` for `(animalTypeId, parameter)`
2. If no range exists: parameter is skipped (no alert)
3. If value is within `[minValue, maxValue]`: no alert
4. Otherwise:

```
range_span    = maxValue - minValue
deviation     = distance from value to nearest boundary
severity_pct  = (deviation / range_span) × 100

0–20%    → LOW
20–50%   → MEDIUM
50–100%  → HIGH
>100%    → CRITICAL
```

Example: pulse = 95, range 60–80
```
range_span = 20
deviation  = 95 - 80 = 15
pct        = 15 / 20 × 100 = 75% → HIGH
```

### Health Status Aggregation

```
GET /anomaly-detection/animals/:animalId/health-summary
```

| Condition | Status |
|---|---|
| No active alerts | HEALTHY |
| Only LOW severity | ATTENTION |
| Any MEDIUM or HIGH | WARNING |
| Any CRITICAL | CRITICAL |

---

## Retraining Loop (Feedback)

After receiving a prediction, veterinarians can submit feedback:

```json
POST /feedbacks
{
  "predictionId": "uuid",
  "veterinarianId": "uuid",
  "rating": 3,
  "comment": "Missed the metabolic component",
  "suggestedDiseaseId": "uuid"
}
```

The `Feedback` records are stored and associated with the `Prediction`. The `suggestedDiseaseId` field indicates the vet's corrected diagnosis. These records provide the labeled data needed to retrain the ML model outside of this backend.

---

## Configuration

```bash
PREDICT_API_URI=http://ml-service:8000/predict
PREDICT_MODEL_VERSION=v1.2.0    # Stored with each Prediction record for traceability
```

The `modelVersion` stored in each `Prediction` record lets you trace which model version produced which prediction, which is important when comparing prediction quality across retraining cycles.

---

## Adding a New Feature

To add a new feature to the ML vector:

1. **Add the field** to the appropriate exam Prisma model and run `prisma migrate`
2. **Add the DTO field** to the exam's `CreateExamDto` and `UpdateExamDto`
3. **Add the extraction** in `MedicalSessionService.submit()` inside the `inputVector` object
4. **If categorical**: add a new lookup table model with `numericValue: Int @unique`, create the corresponding CRUD module, and reference the new FK in the exam model
5. **Update `FEATURE_KEYS`** in `AnomalyDetectionService` if the direct prediction endpoint should also include the new feature
6. **Retrain the ML model** with the updated feature set
7. **Update `PREDICT_MODEL_VERSION`** in environment configuration

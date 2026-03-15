# API Reference

All endpoints are prefixed with the server base URL. The Swagger UI is available at `/swagger` when the server is running.

## Authentication

Most endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

Guard legend used throughout this document:

| Symbol | Meaning |
|---|---|
| 🔓 | Public — no auth required |
| 🔐 | `@IsAuthenticated()` — valid JWT required |
| 🛡️ | `@IsAdminUser()` — JWT + ADMIN or SUPER_ADMIN role |

---

## Auth (`/auth`)

### POST `/auth/login` 🔓
Login with username and password.

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "userId": "uuid",
  "role": "VETERINARIAN"
}
```

**Errors:** `401` invalid credentials, `403` account inactive or deleted.

---

### POST `/auth/refresh` 🔓
Exchange a refresh token for a new access + refresh token pair. Old refresh token is immediately invalidated (rotation).

**Header:** `Authorization: Bearer <refresh_token>`

**Response:**
```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

**Errors:** `401` token invalid, expired, or already revoked.

---

### POST `/auth/logout` 🔐
Revoke the current refresh token (single device logout).

**Body:**
```json
{ "refreshToken": "string" }
```

**Response:** `200 OK`

---

### POST `/auth/logout-all` 🔐
Revoke all refresh tokens for the current user (all device logout).

**Response:** `200 OK`

---

## Users (`/users`)

### GET `/users` 🛡️
Paginated list of users.

**Query params:** `page`, `perPage`, `search`, `role`, `byId`

**Response:** `PaginatedResult<User>`

---

### GET `/users/:id` 🔐
**Response:** `User`

---

### POST `/users` 🛡️
Create a user.

**Body:** `CreateUserDto` — `username`, `password`, `firstName`, `lastName`, `role`, `districtId`, optional profile fields.

---

### PATCH `/users/:id` 🔐
Update own profile. Admins can update any user.

---

### DELETE `/users/:id` 🛡️
Soft delete (sets `deletedAt`).

---

## Animals (`/animals`)

### POST `/animals` 🔐

**Body:**
```json
{
  "arrivalDate": "2026-01-15",
  "age": 3,
  "animalNameCode": "COW-001",
  "animalTypeId": "uuid",
  "animalBreedId": "uuid",
  "animalColorId": "uuid",
  "sexId": "uuid",
  "farmerId": "uuid"
}
```

**Response:** `Animal` with all relations included.

---

### GET `/animals` 🔐

**Query params:** `page`, `perPage`, `search`, `farmerId`, `animalTypeId`, `byId`

**Response:** `PaginatedResult<Animal>`

---

### GET `/animals/:id` 🔐
**Response:** `Animal` with type, breed, color, sex, farmer.

---

### GET `/animals/predict/:id` 🔐
Returns the animal with its latest exams pre-loaded for quick prediction submission. Fetches the most recent clinical, blood, urine, feces, and mucosa exams in parallel.

**Response:** `Animal` + `{ clinicalExam, bloodExam, urineExam, fecesExam, mucosaExams }`

---

### PATCH `/animals/:id` 🔐
Partial update.

---

### DELETE `/animals/:id` 🛡️

---

## Animal Types (`/animal-types`)

Hierarchical species classification (e.g. Cattle → Dairy Cattle).

### POST `/animal-types` 🛡️
```json
{
  "name": { "ru": "Крупный рогатый скот", "uz": "Qoramol" },
  "parentId": "uuid or null"
}
```

### GET `/animal-types` 🔐
**Query params:** `search`, `parentId` (pass `null` for root types), `page`, `perPage`

### GET `/animal-types/:id` 🔐
Returns type with `parent` and `children[]`.

### PATCH `/animal-types/:id` 🛡️
### DELETE `/animal-types/:id` 🛡️

---

## Animal Breeds (`/animal-breeds`)

### POST `/animal-breeds` 🛡️
```json
{ "name": { "ru": "Голштин", "uz": "Golshtin" } }
```

### GET `/animal-breeds` 🔐 — `search`, `page`, `perPage`
### GET `/animal-breeds/:id` 🔐
### PATCH `/animal-breeds/:id` 🛡️
### DELETE `/animal-breeds/:id` 🛡️

---

## Animal Colors (`/animal-colors`)

Same CRUD shape as breeds.

---

## Medical Sessions (`/medical-sessions`)

A medical session groups all five exam types from a single veterinary visit.

### POST `/medical-sessions` 🔐
```json
{
  "animalId": "uuid",
  "veterinarianId": "uuid",
  "date": "2026-03-15T10:00:00Z",
  "notes": "Routine check"
}
```

**Response:** `MedicalSession` (status: `DRAFT`)

---

### GET `/medical-sessions` 🔐
**Query params:** `animalId`, `veterinarianId`, `status` (DRAFT | READY | SUBMITTED), `page`, `perPage`, `byId`

**Response:** `PaginatedResult<MedicalSession>` — each session includes all nested exams and prediction.

---

### GET `/medical-sessions/:id` 🔐
Returns session with all five exam types and prediction fully resolved.

---

### PATCH `/medical-sessions/:id` 🔐
Update `date`, `notes`, `status`, `veterinarianId`.

---

### POST `/medical-sessions/:id/submit` 🔐
The core diagnostic action. Builds an 88-feature numeric vector from all attached exams, calls the external ML service, stores the prediction, and marks the session as `SUBMITTED`.

**Preconditions:** Session must have both a `clinicalExam` and `bloodExam` attached.

**Response:** Full session object including the new `prediction`.

**Errors:**
- `400` — already submitted, or missing required exams
- `400` — ML service returned an error response
- `400` — ML service is unreachable

---

### DELETE `/medical-sessions/:id` 🛡️

---

## Clinical Exams (`/clinical-exams`)

### POST `/clinical-exams` 🔐
```json
{
  "animalId": "uuid",
  "sessionId": "uuid",
  "pulse": 80,
  "temperature": 38.5,
  "respiratoryRate": 20,
  "rumination": 5,
  "rumenInfusoriaCount": 500,
  "bodyTypeId": "uuid",
  "obesityId": "uuid",
  "bodyPositionId": "uuid",
  "constitutionId": "uuid",
  "temperamentId": "uuid",
  "woolId": "uuid",
  "downId": "uuid",
  "hairId": "uuid",
  "feathersId": "uuid",
  "skinColorId": "uuid",
  "skinHumidityId": "uuid",
  "skinSmellId": "uuid",
  "skinTempId": "uuid",
  "skinSurfaceId": "uuid",
  "skinElasticityId": "uuid",
  "skinSensitivityId": "uuid",
  "skinPainId": "uuid",
  "lymphSizeId": "uuid",
  "lymphShapeId": "uuid",
  "lymphSurfaceId": "uuid",
  "lymphConsistencyId": "uuid",
  "lymphTempId": "uuid",
  "lymphPainId": "uuid",
  "lymphMobilityId": "uuid",
  "rumenFluidStateId": "uuid"
}
```

**Validation bounds:**
- `pulse`: 10–300 bpm
- `temperature`: 30–45 °C
- `respiratoryRate`: 1–150 breaths/min
- `rumination`: 0–30 contractions/2 min
- `rumenInfusoriaCount`: 0–1,000,000

All ID fields (`bodyTypeId`, etc.) are optional — only the measurements you have need to be sent.

### GET `/clinical-exams` 🔐 — `animalId`, `sessionId`, `page`, `perPage`
### GET `/clinical-exams/:id` 🔐 — returns exam with all lookup tables resolved
### PATCH `/clinical-exams/:id` 🔐
### DELETE `/clinical-exams/:id` 🛡️

---

## Blood Exams (`/blood-exams`)

### POST `/blood-exams` 🔐
All fields are numeric and optional except `animalId`:
```json
{
  "animalId": "uuid",
  "sessionId": "uuid",
  "coe": 0.35,
  "erythrocyteCount": 5.5,
  "leukocyteCount": 7.2,
  "thrombocyteCount": 250,
  "hemoglobin": 120,
  "glutathione": 0.8,
  "waterPercentage": 78,
  "dryResidue": 22,
  "totalProtein": 72,
  "albumin": 38,
  "totalBilirubin": 5.2,
  "directBilirubin": 1.8,
  "glucose": 3.5,
  "alkalineReserve": 55,
  "ketoneBodies": 0.5,
  "totalCholesterol": 3.8,
  "totalCalcium": 2.5,
  "organicPhosphorus": 1.8,
  "urea": 4.2,
  "copper": 14,
  "cobalt": 0.4,
  "manganese": 0.2,
  "zinc": 60,
  "conclusion": "Within normal limits"
}
```

### GET `/blood-exams` 🔐 — `animalId`, `sessionId`, `page`, `perPage`
### GET `/blood-exams/:id` 🔐
### PATCH `/blood-exams/:id` 🔐
### DELETE `/blood-exams/:id` 🛡️

---

## Urine Exams (`/urine-exams`)

### POST `/urine-exams` 🔐
```json
{
  "animalId": "uuid",
  "sessionId": "uuid",
  "ph": 6.5,
  "amount": 500,
  "acetone": 0,
  "protein": 0.1,
  "bilirubin": 0,
  "sugar": 0,
  "leukocytes": 2,
  "erythrocytes": 1,
  "urineColorId": "uuid",
  "urineSmellId": "uuid",
  "urineClarityId": "uuid",
  "urineConsistencyId": "uuid"
}
```

### GET `/urine-exams` 🔐 — `animalId`, `sessionId`, `page`, `perPage`
### GET `/urine-exams/:id` 🔐
### PATCH `/urine-exams/:id` 🔐
### DELETE `/urine-exams/:id` 🛡️

---

## Feces Exams (`/feces-exams`)

### POST `/feces-exams` 🔐
```json
{
  "animalId": "uuid",
  "sessionId": "uuid",
  "amount": 200,
  "undigestedFood": 5,
  "fecesColorId": "uuid",
  "fecesSmellId": "uuid",
  "fecesConsistencyId": "uuid",
  "fecesFormId": "uuid"
}
```

### GET / GET `:id` / PATCH / DELETE — same pattern

---

## Mucosa Exams (`/mucosa-exams`)

One record per mucosa type. A session can have up to four (oral, nasal, ocular, vaginal).

### POST `/mucosa-exams` 🔐
```json
{
  "animalId": "uuid",
  "sessionId": "uuid",
  "mucosaTypeId": "uuid",
  "mucosaAppearanceId": "uuid"
}
```

---

## Anomaly Detection (`/anomaly-detection`)

### POST `/anomaly-detection/predict` 🔐
Submit a feature vector for immediate prediction and anomaly analysis without going through a session.

**Body:** `PredictDto` — `animalTypeId` (required) + all 88 numeric feature fields (all optional).

Optionally include `animalId` + `sessionId` to have anomaly alerts persisted automatically.

**Response:**
```json
{
  "predictions": { ... },
  "anomalies": [
    {
      "parameter": "pulse",
      "value": 95,
      "minNorm": 60,
      "maxNorm": 80,
      "severity": "HIGH",
      "unit": "beats/min"
    }
  ],
  "overallSeverity": "HIGH",
  "sessionId": "uuid or null"
}
```

---

### GET `/anomaly-detection/trends` 🔐
Time-series trend for a single numeric parameter across sessions.

**Query params:**
| Param | Required | Description |
|---|---|---|
| `animalId` | Yes | Animal UUID |
| `parameter` | Yes | e.g. `pulse`, `hemoglobin`, `glucose` |
| `from` | No | ISO date string |
| `to` | No | ISO date string |
| `limit` | No | Max data points (default: 20) |

**Response:**
```json
{
  "parameter": "hemoglobin",
  "unit": "g/l",
  "dataPoints": [
    { "date": "2026-01-15T00:00:00.000Z", "value": 110 },
    { "date": "2026-02-15T00:00:00.000Z", "value": 115 }
  ],
  "trend": "increasing",
  "changePercent": 4.5
}
```

`trend` is `"stable"` (< 5% change), `"increasing"`, or `"decreasing"`.

---

### GET `/anomaly-detection/alerts` 🔐
Paginated list of anomaly alerts.

**Query params:** `animalId`, `sessionId`, `severity` (LOW | MEDIUM | HIGH | CRITICAL), `status` (NEW | ACKNOWLEDGED | RESOLVED), `page`, `perPage`

**Response:** `PaginatedResult<AnomalyAlert>`

---

### PATCH `/anomaly-detection/alerts/:id` 🔐
Update alert status.

**Body:**
```json
{ "status": "ACKNOWLEDGED" }
```

---

### GET `/anomaly-detection/animals/:animalId/health-summary` 🔐
**Response:**
```json
{
  "animalId": "uuid",
  "activeAlerts": 3,
  "alertsBySeverity": {
    "LOW": 1,
    "MEDIUM": 0,
    "HIGH": 1,
    "CRITICAL": 1
  },
  "healthStatus": "CRITICAL",
  "lastSessionDate": "2026-03-15T10:00:00.000Z",
  "totalSessions": 12
}
```

Health status rules: `HEALTHY` (no alerts) → `ATTENTION` (only LOW) → `WARNING` (any MEDIUM/HIGH) → `CRITICAL` (any CRITICAL).

---

## Reference Ranges (`/reference-ranges`) 🛡️

Defines normal min/max values per parameter per animal type. Used by anomaly detection.

### POST `/reference-ranges`
```json
{
  "animalTypeId": "uuid",
  "parameter": "pulse",
  "minValue": 60,
  "maxValue": 80,
  "unit": "beats/min"
}
```

Unique constraint: `(animalTypeId, parameter)` — one range per parameter per species.

### GET `/reference-ranges` — `animalTypeId`, `parameter`, `page`, `perPage`
### GET `/reference-ranges/:id`
### PATCH `/reference-ranges/:id`
### DELETE `/reference-ranges/:id`

---

## Feedback (`/feedbacks`)

Veterinarian feedback on AI prediction quality, used for model retraining.

### POST `/feedbacks` 🔐
```json
{
  "predictionId": "uuid",
  "veterinarianId": "uuid",
  "rating": 4,
  "comment": "Prediction was mostly correct",
  "suggestedDiseaseId": "uuid"
}
```

`rating`: 1–5 integer.
`suggestedDiseaseId`: optional disease the vet believes the correct diagnosis is.

### GET `/feedbacks` 🔐 — `predictionId`, `veterinarianId`, `page`, `perPage`
### GET `/feedbacks/:id` 🔐
### PATCH `/feedbacks/:id` 🔐
### DELETE `/feedbacks/:id` 🛡️

---

## Diseases (`/diseases`)

### POST `/diseases` 🛡️
```json
{
  "name": { "ru": "Ящур", "uz": "Og'iz va tuyoq kasalligi" },
  "diseaseCategoryId": "uuid"
}
```

### GET `/diseases` 🔐 — `search`, `diseaseCategoryId`, `page`, `perPage`
### GET `/diseases/:id` 🔐
### PATCH `/diseases/:id` 🛡️
### DELETE `/diseases/:id` 🛡️

---

## Disease Categories (`/disease-categories`)

Hierarchical (e.g. Infectious → Viral).

### POST `/disease-categories` 🛡️
```json
{
  "name": { "ru": "Инфекционные", "uz": "Yuqumli kasalliklar" },
  "parentId": "uuid or null"
}
```

### GET / GET `:id` / PATCH / DELETE — standard pattern

---

## Prophylaxis (`/prophylaxis`)

Records of vaccinations, dewormings, and immunizations per animal.

### POST `/prophylaxis` 🔐
```json
{
  "type": "VACCINE",
  "animalId": "uuid",
  "itemId": "uuid",
  "detailId": "uuid",
  "date": "2026-02-01"
}
```

`type`: `VACCINE` | `IMMUNIZATION` | `DEWORMING`

### GET `/prophylaxis` 🔐 — `animalId`, `type`, `page`, `perPage`
### GET `/prophylaxis/:id` 🔐
### GET `/prophylaxis/animal/:animalId/last` 🔐 — returns most recent prophylaxis for an animal
### PATCH `/prophylaxis/:id` 🔐
### DELETE `/prophylaxis/:id` 🛡️

---

## Prophylaxis Items (`/prophylaxis-items`)

Catalog of vaccine/drug names.

### POST `/prophylaxis-items` 🛡️
```json
{
  "name": { "ru": "Вакцина против ящура", "uz": "Og'iz-tuyoq kasalligiga qarshi vaksina" },
  "type": "VACCINE"
}
```

### GET / GET `:id` / PATCH / DELETE

---

## Prophylaxis Details (`/prophylaxis-details`)

Sub-variants of a prophylaxis item (e.g. specific strain, concentration).

### POST `/prophylaxis-details` 🛡️
```json
{
  "name": { "ru": "Серотип А", "uz": "A serotipi" },
  "itemId": "uuid"
}
```

---

## Management

### Regions (`/regions`) 🛡️ for create/update/delete, 🔐 for reads
```json
{ "name": { "ru": "Ташкентская область", "uz": "Toshkent viloyati" } }
```

### Districts (`/districts`)
```json
{
  "name": { "ru": "Чиланзарский район", "uz": "Chilonzor tumani" },
  "regionId": 1
}
```

### Vet Stations (`/vet-stations`)
```json
{
  "name": { "ru": "Ветеринарная станция №1", "uz": "1-sonli veterinariya stantsiyasi" },
  "districtId": "uuid"
}
```

---

## Lookup Tables

All of these follow the same CRUD pattern. They require `@IsAdminUser()` for writes and `@IsAuthenticated()` for reads.

Each record has:
```json
{
  "id": "uuid",
  "name": { "ru": "...", "uz": "..." },
  "numericValue": 1,
  "animalTypeId": "uuid"
}
```

**Urine:**
- `/urine-colors`
- `/urine-smells`
- `/urine-clarities`
- `/urine-consistencies`

**Feces:**
- `/feces-colors`
- `/feces-smells`
- `/feces-consistencies`
- `/feces-forms`

**Mucosa:**
- `/mucosa-types`
- `/mucosa-appearances`

**Clinical (habitus, skin, lymph, rumen):**
- `/body-types`, `/obesity-types`, `/body-positions`, `/constitutions`, `/temperaments`
- `/wool-types`, `/down-types`, `/hair-types`, `/feather-types`
- `/skin-colors`, `/skin-humidities`, `/skin-smells`, `/skin-temps`, `/skin-surfaces`, `/skin-elasticities`, `/skin-sensitivities`, `/skin-pains`
- `/rumen-fluid-states`
- `/lymph-sizes`, `/lymph-shapes`, `/lymph-surfaces`, `/lymph-consistencies`, `/lymph-temps`, `/lymph-pains`, `/lymph-mobilities`

---

## Common Response Shapes

### Paginated Response
```json
{
  "data": [ ... ],
  "meta": {
    "total": 100,
    "lastPage": 10,
    "currentPage": 1,
    "perPage": 10,
    "prev": null,
    "next": 2
  }
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Common Error Codes

| Code | Meaning |
|---|---|
| 400 | Validation error, business rule violation, FK constraint |
| 401 | Missing or invalid JWT |
| 403 | Insufficient role |
| 404 | Record not found |
| 409 | Duplicate unique value, write conflict |
| 500 | Unexpected server error |

# Anomaly Detection & Early Warning System

## Overview

The anomaly detection system provides three capabilities for veterinary diagnostics:

1. **Unified AI Prediction** — Send 85+ exam features to the ML model, receive disease predictions (116 possible diseases for 4 cattle types)
2. **Trend Tracking** — Monitor how an animal's parameters change over time
3. **Anomaly Detection & Early Warning** — Automatically detect values outside normal ranges and alert veterinarians

---

## Architecture

```
                                    ┌─────────────────────┐
                                    │   External ML Model  │
                                    │  (PREDICT_API_URI)   │
                                    └──────────▲──────────┘
                                               │
                                         POST /predict
                                         85 features +
                                         animalTypeId
                                               │
┌──────────────┐    POST /predict    ┌─────────┴──────────┐
│   Frontend   │ ──────────────────► │  AnomalyDetection  │
│              │ ◄────────────────── │     Service         │
│              │   predictions +     │                     │
│              │   anomalies +       │  1. Build vector    │
│              │   severity          │  2. Call ML model   │
└──────────────┘                     │  3. Check ranges    │
                                     │  4. Create alerts   │
                                     └────────┬───────────┘
                                              │
                                     ┌────────▼───────────┐
                                     │     PostgreSQL      │
                                     │                     │
                                     │  reference_ranges   │
                                     │  anomaly_alerts     │
                                     │  medical_sessions   │
                                     │  (all exam tables)  │
                                     └────────────────────┘
```

---

## Database Tables

### `reference_ranges` — What is "normal"

Stores min/max normal values for each parameter per animal type.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| animal_type_id | UUID | FK to animal_types — which cattle type |
| parameter | VARCHAR(100) | Parameter name (e.g. "pulse", "hemoglobin") |
| min_value | FLOAT | Minimum normal value |
| max_value | FLOAT | Maximum normal value |
| unit | VARCHAR(50) | Unit of measurement (e.g. "bpm", "g/l") |

**Unique constraint**: `(animal_type_id, parameter)` — one range per parameter per type.

**Example data:**
```
animal_type: КРС (cattle)
parameter: pulse,        min: 60,    max: 80,   unit: "уд/мин"
parameter: temperature,  min: 37.5,  max: 39.5, unit: "°C"
parameter: hemoglobin,   min: 99,    max: 129,  unit: "г/л"
parameter: glucose,      min: 2.2,   max: 3.3,  unit: "ммоль/л"
```

### `anomaly_alerts` — Detected deviations

Created automatically when a prediction finds values outside reference ranges.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| animal_id | UUID | FK to animals — which animal |
| session_id | UUID | FK to medical_sessions — which exam session |
| parameter | VARCHAR(100) | Which parameter deviated |
| value | FLOAT | Actual measured value |
| min_norm | FLOAT | Expected minimum |
| max_norm | FLOAT | Expected maximum |
| severity | ENUM | LOW, MEDIUM, HIGH, CRITICAL |
| status | ENUM | NEW, ACKNOWLEDGED, RESOLVED |

---

## Severity Calculation

Severity is based on how far outside the normal range a value falls, as a percentage of the range span:

```
Range span = max - min
Deviation = how far the value is outside the range

Deviation % = (deviation / range_span) × 100

┌─────────────────┬──────────────────────────────────────────┐
│ Deviation %     │ Severity                                 │
├─────────────────┼──────────────────────────────────────────┤
│ Within range    │ No anomaly (OK)                          │
│ 0% — 20%       │ LOW — minor deviation, monitor            │
│ 20% — 50%      │ MEDIUM — needs veterinarian attention     │
│ 50% — 100%     │ HIGH — concerning, action recommended     │
│ > 100%         │ CRITICAL — dangerous, immediate action    │
└─────────────────┴──────────────────────────────────────────┘
```

**Example:**
```
Parameter: pulse
Normal range: 60-80 bpm (span = 20)

Value 70  → within range → OK
Value 82  → deviation 2,  2/20  = 10%  → LOW
Value 87  → deviation 7,  7/20  = 35%  → MEDIUM
Value 95  → deviation 15, 15/20 = 75%  → HIGH
Value 110 → deviation 30, 30/20 = 150% → CRITICAL
Value 55  → deviation 5,  5/20  = 25%  → MEDIUM (below range)
```

---

## Health Status

The health summary endpoint aggregates all active (unresolved) alerts for an animal:

| Status | Condition |
|--------|-----------|
| **HEALTHY** | No active alerts |
| **ATTENTION** | Only LOW severity alerts |
| **WARNING** | Has MEDIUM or HIGH alerts |
| **CRITICAL** | Has any CRITICAL alerts |

---

## The 88 Features (ML Model Input)

The ML model accepts a numeric array. Each value is either a direct measurement or a numeric label from a lookup table.

### Features 1-3: Physical Indicators
| # | Feature | Unit | Source |
|---|---------|------|--------|
| 1 | Pulse (Пульс) | beats/min | ClinicalExam.pulse |
| 2 | Respiration (Дыхание) | breaths/min | ClinicalExam.respiratoryRate |
| 3 | Temperature (Температура) | °C | ClinicalExam.temperature |

### Features 4-11: Whole Blood (Цельная кровь)
| # | Feature | Unit | Source |
|---|---------|------|--------|
| 4 | Erythrocytes (Эритроциты) | mln/mcl | BloodExam.erythrocyteCount |
| 5 | Leukocytes (Лейкоциты) | thous/mcl | BloodExam.leukocyteCount |
| 6 | Thrombocytes (Тромбоциты) | thous/mcl | BloodExam.thrombocyteCount |
| 7 | ESR / СОЭ | mm/h | BloodExam.coe |
| 8 | Water (Вода) | % | BloodExam.waterPercentage |
| 9 | Dry residue (Сухой остаток) | % | BloodExam.dryResidue |
| 10 | Glutathione (Глутатион) | mmol/l | BloodExam.glutathione |
| 11 | Hemoglobin (Гемоглобин) | g/l | BloodExam.hemoglobin |

### Features 12-41: Blood Serum (Сыворотка крови)
| # | Feature | Unit | Source |
|---|---------|------|--------|
| 12 | Total protein (Общий белок) | g/l | BloodExam.totalProtein |
| 13 | Albumins (Альбумины) | % | BloodExam.albumin |
| 14 | Alpha-globulins (Альфа-глобулины) | % | BloodExam.alphaGlobulin |
| 15 | Beta-globulins (Бета-глобулины) | % | BloodExam.betaGlobulin |
| 16 | Gamma-globulins (Гамма-глобулины) | % | BloodExam.gammaGlobulin |
| 17 | Residual nitrogen (Остаточный азот) | mmol/l | BloodExam.residualNitrogen |
| 18 | Urea (Мочевина) | mmol/l | BloodExam.urea |
| 19 | Uric acid (Мочевая кислота) | mmol/l | BloodExam.uricAcid |
| 20 | Creatinine (Креатинин) | mcmol/l | BloodExam.creatinine |
| 21 | Alkaline reserve (Щелочной резерв) | vol% CO2 | BloodExam.alkalineReserve |
| 22 | Glucose (Глюкоза) | mmol/l | BloodExam.glucose |
| 23 | Ketone bodies (Кетоновые тела) | g/l | BloodExam.ketoneBodies |
| 24 | Total bilirubin (Билирубин общий) | mcmol/l | BloodExam.totalBilirubin |
| 25 | Direct bilirubin (Билирубин прямой) | mcmol/l | BloodExam.directBilirubin |
| 26 | Total cholesterol (Холестерол общий) | mmol/l | BloodExam.totalCholesterol |
| 27 | Total lipids (Общие липиды) | g/l | BloodExam.totalLipids |
| 28 | Phospholipids (Фосфолипиды) | g/l | BloodExam.phospholipids |
| 29 | Lactic acid (Молочная кислота) | mmol/l | BloodExam.lacticAcid |
| 30 | Pyruvic acid (Пировиноградная кислота) | mmol/l | BloodExam.pyruvicAcid |
| 31 | Citric acid (Лимонная кислота) | mmol/l | BloodExam.citricAcid |
| 32 | Carotene (Каротин) | mcmol/l | BloodExam.carotene |
| 33 | Vitamin A (Витамин А) | mcmol/l | BloodExam.vitaminA |
| 34 | Vitamin C (Витамин С) | mcmol/l | BloodExam.vitaminC |
| 35 | Total phosphorus (Общий фосфор) | mmol/l | BloodExam.organicPhosphorus |
| 36 | Total calcium (Общий кальций) | mmol/l | BloodExam.totalCalcium |
| 37 | Creatine (Креатин) | mmol/l | BloodExam.creatine |
| 38 | Copper (Медь) | mmol/l | BloodExam.copper |
| 39 | Zinc (Цинк) | mmol/l | BloodExam.zinc |
| 40 | Manganese (Марганец) | mmol/l | BloodExam.manganese |
| 41 | Cobalt (Кобальт) | mmol/l | BloodExam.cobalt |

### Features 42-57: Urine (Моча)

Features 42-45 use **numeric labels** from lookup tables:

| # | Feature | Labels | Source |
|---|---------|--------|--------|
| 42 | Urine color (Цвет) | 0=light yellow, 1=brown, 2=red, 3=dark, 4=milky | UrineColor.numericValue |
| 43 | Urine smell (Запах) | 0=normal, 1=ammonia, 2=sharp, 3=acetone | UrineSmell.numericValue |
| 44 | Urine clarity (Прозрачность) | 0=clear, 1=cloudy | UrineClarity.numericValue |
| 45 | Urine consistency (Консистенция) | 0=liquid, 1=thick, 2=sticky | UrineConsistency.numericValue |

Features 46-57 are numeric measurements:

| # | Feature | Unit | Source |
|---|---------|------|--------|
| 46 | pH (Среда) | — | UrineExam.ph |
| 47 | Ketone bodies / Acetone (Ацетон) | mmol/l | UrineExam.acetone |
| 48 | Protein (Белок) | g/l | UrineExam.protein |
| 49 | Bilirubin (Билирубин) | mcmol/l | UrineExam.bilirubin |
| 50 | Urobilinogen (Уробилирубин) | mcmol/l | UrineExam.urobilinogen |
| 51 | Sugar (Сахар) | mmol/l | UrineExam.sugar |
| 52 | Leukocytes (Лейкоциты) | count | UrineExam.leukocytes |
| 53 | Epithelium (Эпителий) | count | UrineExam.epithelium |
| 54 | Microbial bodies (Микробные тела) | 0=none, 1=bacteria, 2=fungi | UrineExam.microbialBodies |
| 55 | Erythrocytes (Эритроциты) | count | UrineExam.erythrocytes |
| 56 | Salt crystals (Кристаллы солей) | 0=none, 1=present, 2=many, 3=few, 4=moderate | UrineExam.saltCrystals |
| 57 | Amount (Количество) | l/day | UrineExam.amount |

### Features 58-63: Feces (Навоз)

Features 58-61 use **numeric labels** from lookup tables:

| # | Feature | Labels | Source |
|---|---------|--------|--------|
| 58 | Feces smell (Запах) | 0=mild grassy, 1=sharp, 2=rotten | FecesSmell.numericValue |
| 59 | Feces color (Цвет) | 0=green, 1=brown, 2=yellow, 3=red, 4=dark, 5=yellow-green | FecesColor.numericValue |
| 60 | Feces consistency (Консистенция) | 0=soft, 1=liquid, 2=watery, 3=hard | FecesConsistency.numericValue |
| 61 | Feces form (Форма) | 0=flat disc, 1=soft mass, 2=shapeless | FecesForm.numericValue |

| # | Feature | Unit | Source |
|---|---------|------|--------|
| 62 | Feces amount (Количество) | kg | FecesExam.amount |
| 63 | Undigested food (Непереваренная пища) | % | FecesExam.undigestedFood |

### Features 64-67: Mucosa (Шиллиқ пардалар)

Each mucosa type has its own appearance labels. All use **numeric labels**:

| # | Feature | Labels (examples) | Source |
|---|---------|-------------------|--------|
| 64 | Oral mucosa (Оральная) | 0=normal, 1=reddened, 2=swollen, 3=dry, 4=cracks, 5=ulcers | MucosaAppearance.numericValue (where mucosaType=0) |
| 65 | Nasal mucosa (Назальная) | 0=normal, 1=clear discharge, 2=reddened | MucosaAppearance.numericValue (where mucosaType=1) |
| 66 | Ocular mucosa (Окулярная) | 0=pink, 1=light red, 2=smooth, ... 16=purulent | MucosaAppearance.numericValue (where mucosaType=2) |
| 67 | Vaginal mucosa (Влагалищная) | 0=pink, 1=moist, 2=smooth, ... 11=bad odor | MucosaAppearance.numericValue (where mucosaType=3) |

**Implementation note:** A session can have multiple `MucosaExam` records (1:N). The system finds each mucosa type by `mucosaType.numericValue` (0=oral, 1=nasal, 2=ocular, 3=vaginal) and extracts the corresponding `mucosaAppearance.numericValue`.

### Features 68-85+: Clinical Observations (Клинические показатели)

All clinical observation features use **numeric labels** from lookup tables:

| # | Feature | Source (lookup table) |
|---|---------|----------------------|
| 68 | Rumination (Жвачка) | ClinicalExam.rumination (direct Int) |
| 69 | Obesity (Избыточный вес) | ObesityType.numericValue |
| 70 | Body condition (Состояние тела) | BodyType.numericValue |
| 71 | Body position (Поза тела) | BodyPosition.numericValue |
| 72 | Wool/hair (Шерсть) | WoolType.numericValue |
| 73 | Skin color (Цвет кожи) | SkinColor.numericValue |
| 74 | Skin humidity (Влажность кожи) | SkinHumidity.numericValue |
| 75 | Skin smell (Запах кожи) | **SkinSmell.numericValue** |
| 76 | Skin temperature (Температура кожи) | SkinTemp.numericValue |
| 77 | Skin surface (Поверхность кожи) | **SkinSurface.numericValue** |
| 78 | Skin elasticity (Эластичность кожи) | SkinElasticity.numericValue |
| — | Skin sensitivity (Чувствительность кожи) | **SkinSensitivity.numericValue** |
| — | Skin pain (Боль кожи) | **SkinPain.numericValue** |
| — | Rumen fluid state (Состояние рубцовой жидкости) | **RumenFluidState.numericValue** |
| 79 | Lymph node size (Размер лимфоузла) | LymphSize.numericValue |
| 80 | Lymph node shape (Форма лимфоузла) | LymphShape.numericValue |
| 81 | Lymph node surface (Поверхность лимфоузла) | LymphSurface.numericValue |
| 82 | Lymph node consistency (Консистенция лимфоузла) | LymphConsistency.numericValue |
| 83 | Lymph node temperature (Температура лимфоузла) | LymphTemp.numericValue |
| 84 | Lymph node pain (Боль лимфоузла) | LymphPain.numericValue |
| 85 | Lymph node mobility (Подвижность лимфоузла) | LymphMobility.numericValue |

**Bold** items were previously stored as plain strings and have been converted to numeric lookup tables.

---

## Lookup Table Pattern

All categorical values follow the same database pattern:

```sql
CREATE TABLE "skin_smells" (
    "id"            UUID PRIMARY KEY,
    "name"          JSONB NOT NULL,        -- { "ru": "Без запаха", "uz": "Hidsiz" }
    "numeric_value" INTEGER UNIQUE NOT NULL -- 0, 1, 2, 3...
);
```

- `name` — bilingual label (Russian + Uzbek) for display in the UI
- `numeric_value` — integer code passed to the ML model for training/prediction

The `ClinicalExam` table references each lookup via a foreign key (`skin_smell_id → skin_smells.id`).

**How it works in prediction:**
```
ClinicalExam → skinSmell (FK) → SkinSmell { name: "Ацетоновый", numericValue: 3 }
                                                                         ↓
                                                                ML model gets: 3
```

---

## API Endpoints

### Prediction

```
POST /anomaly-detection/predict
```

**Request body:**
```json
{
  "animalTypeId": "uuid-of-cattle-type",
  "animalId": "uuid-of-animal",          // optional, for alert tracking
  "sessionId": "uuid-of-session",        // optional, for alert tracking
  "pulse": 75,
  "temperature": 38.5,
  "hemoglobin": 120,
  "glucose": 3.1,
  "urineColor": 0,
  "fecesSmell": 1,
  "mucosaOral": 0,
  "skinSmell": 2,
  // ... (any of 88 features, all optional)
}
```

**Response:**
```json
{
  "predictions": {
    "disease": "Гастрит",
    "confidence": 0.87,
    "alternatives": [...]
  },
  "anomalies": [
    {
      "parameter": "pulse",
      "value": 110,
      "minNorm": 60,
      "maxNorm": 80,
      "severity": "CRITICAL"
    },
    {
      "parameter": "glucose",
      "value": 4.5,
      "minNorm": 2.2,
      "maxNorm": 3.3,
      "severity": "HIGH"
    }
  ],
  "overallSeverity": "CRITICAL",
  "sessionId": "uuid-or-null"
}
```

### Trend Tracking

```
GET /anomaly-detection/trends?animalId=uuid&parameter=hemoglobin&from=2026-01-01&to=2026-03-15&limit=20
```

**Response:**
```json
{
  "parameter": "hemoglobin",
  "unit": "g/l",
  "dataPoints": [
    { "date": "2026-01-15T10:00:00Z", "value": 100 },
    { "date": "2026-02-15T10:00:00Z", "value": 110 },
    { "date": "2026-03-15T10:00:00Z", "value": 120 }
  ],
  "trend": "increasing",
  "changePercent": 20.0
}
```

Trend direction: `stable` (< 5% change), `increasing` (> 5%), `decreasing` (< -5%).

### Alerts

```
GET /anomaly-detection/alerts?animalId=uuid&severity=HIGH&status=NEW&page=1&perPage=10
```

```
PATCH /anomaly-detection/alerts/:id
Body: { "status": "ACKNOWLEDGED" }   // or "RESOLVED"
```

### Health Summary

```
GET /anomaly-detection/animals/:animalId/health-summary
```

**Response:**
```json
{
  "animalId": "uuid",
  "activeAlerts": 5,
  "alertsBySeverity": {
    "LOW": 2,
    "MEDIUM": 1,
    "HIGH": 1,
    "CRITICAL": 1
  },
  "healthStatus": "CRITICAL",
  "lastSessionDate": "2026-03-15T10:00:00Z",
  "totalSessions": 12
}
```

### Reference Ranges (Admin only)

```
POST   /reference-ranges       — create new range
GET    /reference-ranges       — list (filter by animalTypeId)
GET    /reference-ranges/:id   — get by ID
PATCH  /reference-ranges/:id   — update min/max values
DELETE /reference-ranges/:id   — delete
```

---

## 116 Diseases (ML Model Output)

The ML model can predict any of these 116 diseases:

| # | Disease (Russian) |
|---|-------------------|
| 1 | Стоматит |
| 2 | Фарингит |
| 3 | Гипотония преджелудков |
| 4 | Атония преджелудков |
| 5 | Парез рубца |
| 6 | Алиментарная дистрофия |
| 7 | Ожирение |
| 8 | Кетоз молочных коров |
| 9 | Кетонурия суягных овец |
| 10 | Миоглобинурия |
| 11-16 | Нефрит, Нефроз, Нефросклероз, Пиелонефрит, Уроцистит, Мочекаменная болезнь |
| 17 | Хроническая гематурия КРС |
| 18-27 | Солнечный удар → Менингоэнцефалит |
| 28-31 | Стресс, Неврозы, Эпилепсия, Эклампсия |
| 32-50 | Ацидоз → Перитонит |
| 51-75 | Брюшная водянка → Триходесмотоксикоз |
| 76-96 | Остеодистрофия → Недостаточность цианкобаламина |
| 97-100 | Сахарный диабет → Эндемический зоб |
| 101-106 | Перикардит → Атеросклероз |
| 107-116 | Ринит → Пневмоторакс |

---

## Data Flow

### 1. Creating a Medical Session

```
Vet creates session → adds exams → submits for prediction
```

1. `POST /medical-sessions` — creates a new session for an animal
2. Vet adds exams:
   - `POST /clinical-exams` — physical + clinical observations
   - `POST /blood-exams` — blood analysis
   - `POST /urine-exams` — urine analysis
   - `POST /feces-exams` — feces analysis
   - `POST /mucosa-exams` — mucosa examination (one per type)
3. `POST /medical-sessions/:id/submit` — submits to ML model

### 2. Using Anomaly Detection Directly

```
POST /anomaly-detection/predict
```

Can be used without creating a session — just send features directly. If `animalId` and `sessionId` are provided, alerts will be persisted.

### 3. Monitoring Over Time

```
GET /anomaly-detection/trends?animalId=...&parameter=hemoglobin
GET /anomaly-detection/animals/:id/health-summary
GET /anomaly-detection/alerts?animalId=...&status=NEW
```

---

## Setup Steps

### 1. Run migrations

```bash
yarn prisma:migrate
```

This creates the `reference_ranges`, `anomaly_alerts`, and 5 new lookup tables (`skin_smells`, `skin_surfaces`, `skin_sensitivities`, `skin_pains`, `rumen_fluid_states`).

### 2. Seed reference ranges

Populate `reference_ranges` with normal values for each of your 4 cattle types. Use:

```
POST /reference-ranges
{
  "animalTypeId": "uuid-of-cattle-type",
  "parameter": "pulse",
  "minValue": 60,
  "maxValue": 80,
  "unit": "уд/мин"
}
```

### 3. Seed new lookup tables

Populate the 5 new lookup tables with bilingual names and numeric values:

```
POST /skin-smells (if endpoint exists, or via prisma:seed)
{ "name": { "ru": "Без запаха", "uz": "Hidsiz" }, "numericValue": 0 }
{ "name": { "ru": "Ацетоновый", "uz": "Atseton hidli" }, "numericValue": 1 }
...
```

### 4. Configure ML service

Set `PREDICT_API_URI` in your `.env`:

```
PREDICT_API_URI=http://localhost:3005/predict
```

---

## File Structure

```
src/modules/diagnostics/anomaly-detection/
├── anomaly-detection.module.ts        # NestJS module registration
├── anomaly-detection.controller.ts    # REST endpoints (prediction, trends, alerts, health)
├── anomaly-detection.service.ts       # Core business logic
├── anomaly-detection.service.spec.ts  # Unit tests
├── reference-range.service.ts         # Reference range CRUD + anomaly checking
├── reference-range.service.spec.ts    # Unit tests
├── dto/
│   ├── predict.dto.ts                 # 88 feature fields + animalTypeId
│   ├── trend-query.dto.ts             # animalId + parameter + date range
│   ├── anomaly-query.dto.ts           # Alert list filters
│   ├── update-alert.dto.ts            # Status update (ACKNOWLEDGED/RESOLVED)
│   ├── create-reference-range.dto.ts  # Reference range creation
│   ├── update-reference-range.dto.ts  # Reference range update
│   ├── reference-range-query.dto.ts   # Reference range list filters
│   └── index.ts
└── entities/
    ├── prediction-result.entity.ts    # Prediction + anomalies response
    ├── trend.entity.ts                # Trend data points response
    ├── anomaly-alert.entity.ts        # Alert response
    ├── health-summary.entity.ts       # Health dashboard response
    ├── reference-range.entity.ts      # Reference range response
    └── index.ts

prisma/schema/
├── anomaly.prisma                     # ReferenceRange + AnomalyAlert models
├── clinical-exam.prisma               # Updated: 5 string fields → lookup tables
├── session.prisma                     # Updated: AnomalyAlert relation
└── inventory.prisma                   # Updated: ReferenceRange relation
```

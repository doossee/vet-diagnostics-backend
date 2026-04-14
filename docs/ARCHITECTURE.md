# Architecture Overview

## System Purpose

The Vet Diagnostics Backend is a REST API that powers a veterinary health management platform for Uzbekistan. It manages animal records, collects five types of clinical exams, submits them to an external ML model for disease prediction, and runs a real-time anomaly detection system over measured values.

The system is bilingual (Russian and Uzbek) throughout. Every lookup table stores its label as a JSONB field `{ ru: string, uz: string }`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | NestJS 11 |
| Language | TypeScript 5 |
| ORM | Prisma 7 (modular schema) |
| Database | PostgreSQL (via PrismaPg connection pool adapter) |
| Auth | Passport.js + JWT (access + refresh token rotation) |
| Validation | class-validator + class-transformer |
| HTTP Client | Axios (for external ML service calls) |
| API Docs | Swagger / OpenAPI |
| File Uploads | Multer + ServeStaticModule |
| Testing | Jest + ts-jest |

---

## Directory Structure

```
vet-diagnostics-backend/
├── src/
│   ├── main.ts                      # Bootstrap: CORS, global pipes, Swagger
│   ├── auth/                        # JWT authentication domain
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── users/                   # User CRUD
│   │   ├── strategies/              # Passport JWT strategy
│   │   ├── guards/                  # JwtAuthGuard, RolesGuard
│   │   └── decorators/              # @IsAuthenticated, @IsAdminUser, @Public, @GetCurrentUser
│   ├── core/
│   │   ├── core.module.ts           # Root module (ServeStatic, interceptors, all feature modules)
│   │   ├── prisma/
│   │   │   ├── prisma.service.ts    # Extends PrismaClient with PrismaPg adapter
│   │   │   └── prisma.module.ts
│   │   └── config/
│   │       └── multer.config.ts
│   ├── shared/
│   │   ├── shared.module.ts         # @Global() — exports PaginationService
│   │   ├── services/
│   │   │   ├── pagination.service.ts
│   │   │   └── image.service.ts
│   │   ├── interceptors/
│   │   │   └── response-transform.interceptor.ts   # Global: Decimal→number, Date→ISO, image prefix
│   │   ├── filters/
│   │   │   └── prisma-exception.filter.ts          # Maps Prisma errors to HTTP status codes
│   │   ├── decorators/
│   │   │   ├── auth.decorator.ts                   # @IsAuthenticated, @IsAdminUser
│   │   │   └── public.decorator.ts                 # @Public
│   │   ├── dto/
│   │   │   ├── base-query-params.dto.ts            # page, perPage, search, byId, lang
│   │   │   └── name.dto.ts                         # { ru: string, uz: string }
│   │   ├── entities/
│   │   │   └── pagination-meta.entity.ts
│   │   └── constants/
│   └── modules/
│       ├── diagnostics/
│       │   ├── medical-session/     # Groups all exams; submit triggers ML call
│       │   ├── clinical-exam/       # Vitals + 35 categorical lookups
│       │   ├── blood-exam/          # 40+ serum/morphology/trace fields
│       │   ├── urine-exam/          # 12 numeric + 4 lookup fields
│       │   ├── feces-exam/          # 2 numeric + 4 lookup fields
│       │   ├── mucosa-exam/         # 4 types (oral/nasal/ocular/vaginal)
│       │   ├── anomaly-detection/   # Reference ranges, alerts, trends, health summary
│       │   ├── feedback/            # Vet ratings on AI predictions (retraining loop)
│       │   └── [lookup tables]      # urine-color, feces-smell, mucosa-appearance, etc.
│       ├── inventory/
│       │   ├── animal/              # Core animal record
│       │   ├── animal-type/         # Hierarchical species classification
│       │   ├── animal-breed/
│       │   └── animal-color/
│       ├── medical/
│       │   ├── disease/             # Disease catalog
│       │   ├── disease-category/    # Hierarchical disease classification
│       │   ├── prophylaxis/         # Vaccination/deworming records
│       │   ├── prophylaxis-item/    # Vaccine/drug catalog
│       │   └── prophylaxis-detail/  # Strains / sub-types
│       └── management/
│           ├── region/
│           ├── district/
│           └── vet-station/
├── prisma/
│   └── schema/
│       ├── schema.prisma            # Master file (includes all others)
│       ├── auth.prisma
│       ├── inventory.prisma
│       ├── medical.prisma
│       ├── session.prisma           # MedicalSession, Prediction, Feedback
│       ├── clinical-exam.prisma     # ClinicalExam + 30+ lookup models
│       ├── blood-exam.prisma
│       ├── urine-exam.prisma
│       ├── feces-exam.prisma
│       ├── mucosa-exam.prisma
│       ├── anomaly.prisma           # ReferenceRange, AnomalyAlert
│       └── management.prisma
├── test/
│   ├── jest-setup.ts
│   ├── helpers/
│   ├── utils/
│   └── *.e2e-spec.ts
└── docs/
    ├── ARCHITECTURE.md              ← you are here
    ├── API.md
    ├── DATA_MODEL.md
    ├── AUTH.md
    ├── ML_AI.md
    ├── MODULES.md
    └── ANOMALY_DETECTION_SYSTEM.md
```

---

## Module Dependency Graph

```
CoreModule
├── ConfigModule (global)
├── ServeStaticModule  (/uploads)
├── SharedModule (global)  →  exports PaginationService
├── PrismaModule           →  exports PrismaService
├── AuthModule             →  exports JwtAccessStrategy, AuthService
├── HealthModule
├── DiagnosticsModule
│   ├── MedicalSessionModule
│   ├── ClinicalExamModule
│   ├── BloodExamModule
│   ├── UrineExamModule
│   ├── FecesExamModule
│   ├── MucosaExamModule
│   ├── AnomalyDetectionModule
│   ├── FeedbackModule
│   └── [Lookup table modules]
├── InventoryModule
│   ├── AnimalModule
│   ├── AnimalTypeModule
│   ├── AnimalBreedModule
│   └── AnimalColorModule
├── MedicalModule
│   ├── DiseaseModule
│   ├── DiseaseCategoryModule
│   ├── ProphylaxisModule
│   ├── ProphylaxisItemModule
│   └── ProphylaxisDetailModule
└── ManagementModule
    ├── RegionModule
    ├── DistrictModule
    └── VetStationModule
```

---

## Request Lifecycle

```
HTTP Request
    │
    ▼
NestJS Router (controller method matching)
    │
    ▼
Guards (JwtAuthGuard → RolesGuard)
    │  — 401 if token invalid/missing
    │  — 403 if role insufficient
    ▼
Global ValidationPipe
    │  — 400 if DTO validation fails
    │  — whitelist: true (strips unknown fields)
    │  — transform: true (converts plain object to DTO instance)
    ▼
Controller Handler
    │
    ▼
Service (business logic + Prisma queries)
    │
    ▼
PrismaService (database)
    │
    ▼
ResponseTransformInterceptor (wraps response)
    │  — Decimal → number
    │  — Date → ISO string
    │  — image → BASE_URL/image
    ▼
HTTP Response

──── On Error ────

PrismaClientKnownRequestError
    │
    ▼
PrismaExceptionFilter (maps to HTTP status)
```

---

## Global Providers

| Provider | Scope | Purpose |
|---|---|---|
| `ConfigModule` | Global | Loads `.env`, provides `ConfigService` |
| `SharedModule` | Global | Exports `PaginationService` |
| `ResponseTransformInterceptor` | Global (APP_INTERCEPTOR) | Normalises all responses |
| `ValidationPipe` | Global | Validates + transforms all request bodies/queries |
| `PrismaExceptionFilter` | Global | Converts Prisma errors to HTTP errors |

---

## Key Design Patterns

### Bilingual JSONB Names
All lookup tables (and region/district/etc.) store their label as:
```typescript
name: Json  // { ru: string, uz: string }
```
Search uses `string_contains` on the JSONB path:
```typescript
OR: [
  { name: { path: ['ru'], string_contains: search } },
  { name: { path: ['uz'], string_contains: search } },
]
```

### ML Numeric Values
Every categorical lookup table has `numericValue: Int @unique`. This value is passed directly into the ML model's feature vector. No encoding step required in the application layer.

### Modular Prisma Schema
The schema is split across 11 domain files. A top-level `schema.prisma` composes them via Prisma's multi-file schema feature. This keeps domain boundaries clear and prevents merge conflicts on large teams.

### Consistent Module Structure
Every feature module follows the same file layout:
```
feature/
├── feature.controller.ts
├── feature.service.ts
├── feature.module.ts
├── dto/
│   ├── create-feature.dto.ts
│   ├── update-feature.dto.ts
│   └── query-params.dto.ts
└── entities/
    ├── feature.entity.ts
    └── paginated-feature.entity.ts
```

### Pagination
All list endpoints use a single shared `PaginationService.paginate()` call, returning a consistent `{ data, meta }` envelope with `total`, `lastPage`, `currentPage`, `perPage`, `prev`, `next`.

---

## End-to-End Data Flow: Diagnostic Session

```
1. Vet creates animal
   POST /animals → Animal record

2. Vet creates medical session
   POST /medical-sessions → MedicalSession (status: DRAFT)

3. Vet fills in exams (any combination)
   POST /clinical-exams     → ClinicalExam (linked to session)
   POST /blood-exams        → BloodExam (linked to session)
   POST /urine-exams        → UrineExam (optional)
   POST /feces-exams        → FecesExam (optional)
   POST /mucosa-exams ×4    → MucosaExam[] (optional, one per type)

4. Vet submits session
   POST /medical-sessions/:id/submit
   │
   ├── Validates: clinicalExam AND bloodExam must exist
   ├── Builds inputVector (88 numeric features from all exams)
   ├── POST to PREDICT_API_URI { params: number[] }
   ├── Receives rawOutput from ML model
   ├── Atomically:
   │   ├── Creates Prediction { inputVector, rawOutput, modelVersion }
   │   └── Updates MedicalSession.status = SUBMITTED
   └── Returns session with prediction

5. Vet views results
   GET /medical-sessions/:id → session + all exams + prediction

6. Vet gives feedback
   POST /feedbacks { predictionId, rating, suggestedDiseaseId? }
   → Stored for model retraining loop
```

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Yes | Min 32 chars |
| `JWT_REFRESH_SECRET` | Yes | Min 32 chars |
| `JWT_ACCESS_EXPIRE` | Yes | e.g. `15m` |
| `JWT_REFRESH_EXPIRE` | Yes | e.g. `7d` |
| `PREDICT_API_URI` | Yes | External ML service URL |
| `PREDICT_MODEL_VERSION` | No | Stored with each Prediction record |
| `APPLICATION_PORT` | Yes | HTTP port |
| `BASE_URL` | Yes | Used for image URL prefixing |
| `CORS_ORIGIN` | No | Comma-separated list of allowed origins |
| `UPLOAD_DEST` | Yes | File upload directory path |
| `IS_DEV_ENV` | No | Loads `.env` file when truthy |

# Module Reference

Every NestJS module in this project follows the same structural pattern:
```
feature/
├── feature.module.ts        # NestJS module declaration
├── feature.controller.ts    # HTTP handlers, Swagger decorators
├── feature.service.ts       # Business logic + Prisma calls
├── dto/
│   ├── create-feature.dto.ts
│   ├── update-feature.dto.ts
│   └── query-params.dto.ts
└── entities/
    ├── feature.entity.ts
    └── paginated-feature.entity.ts
```

---

## Core (`src/core/`)

### CoreModule
The root NestJS module. Registers all application-level infrastructure:
- `ConfigModule.forRoot()` — loads `.env` in development
- `ServeStaticModule` — serves `/uploads` directory at `/uploads` URL path
- `APP_INTERCEPTOR` — binds `ResponseTransformInterceptor` globally
- Imports: `SharedModule`, `PrismaModule`, `AuthModule`, `HealthModule`, and all four feature domains

### PrismaService (`core/prisma/prisma.service.ts`)
Extends Prisma's generated `PrismaClient` and integrates with the `PrismaPg` connection pool adapter.

```typescript
class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    super({ adapter });
  }

  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}
```

All services receive `PrismaService` via dependency injection and use it as their data access layer. The PrismaPg adapter is required because the project uses a PostgreSQL connection pool (suitable for production/serverless environments).

---

## Shared (`src/shared/`)

A `@Global()` NestJS module. Any module in the app can use `PaginationService` without explicitly importing `SharedModule`.

### PaginationService

```typescript
paginate<T>(
  model: any,                          // Prisma model delegate (e.g. this.prisma.animal)
  args: { where?, orderBy?, include? },
  options: { page?, perPage? }
): Promise<PaginatedResult<T>>
```

Runs two queries in parallel: `model.count({ where })` and `model.findMany({ ...args, take, skip })`. Returns:
```typescript
{
  data: T[],
  meta: {
    total: number,
    lastPage: number,
    currentPage: number,
    perPage: number,
    prev: number | null,
    next: number | null,
  }
}
```

Default page size: 10.

---

### ResponseTransformInterceptor (`shared/interceptors/`)

Applied globally via `APP_INTERCEPTOR`. Recursively transforms the response body before it is serialized to JSON:

| Input | Output |
|---|---|
| Prisma `Decimal` instance | Plain JavaScript `number` |
| `Date` object | ISO 8601 string |
| `image` field containing a relative path | Path prefixed with `BASE_URL` env var |
| Arrays | Each element transformed |
| Nested objects | Recursively transformed |

This means services never need to manually convert types — raw Prisma results can be returned directly.

---

### PrismaExceptionFilter (`shared/filters/`)

Catches `Prisma.PrismaClientKnownRequestError` exceptions thrown by any Prisma query. Maps known error codes to HTTP status codes:

| Prisma Code | HTTP Status | Message |
|---|---|---|
| P2000 | 400 | The provided value is too long |
| P2001 | 404 | Record not found |
| P2002 | 409 | A record with this value already exists |
| P2003 | 400 | Foreign key constraint failed |
| P2014 | 400 | Required relation constraint violated |
| P2015 | 404 | A related record could not be found |
| P2018 | 404 | Required connected records were not found |
| P2020 | 400 | Value out of range for the field |
| P2025 | 404 | Record not found |
| P2034 | 409 | Write conflict or deadlock — please retry |
| Any other | 500 | An unexpected error occurred |

---

### Base DTOs

**`NameDto`** — used in every create/update DTO for bilingual names:
```typescript
class NameDto {
  @IsString() @IsNotEmpty()
  ru: string;

  @IsString() @IsNotEmpty()
  uz: string;
}
```

**`BaseQueryParamsDto`** — extended by every list endpoint query DTO:
```typescript
class BaseQueryParamsDto {
  search?: string;    // Substring search on name field (both ru and uz)
  page?: number;      // Default: 1
  perPage?: number;   // Default: 10
  byId?: SortOrder;   // 'asc' | 'desc' — sort by id
  lang?: LangType;    // 'ru' | 'uz' | 'en'
}
```

---

## Auth (`src/auth/`)

### AuthService

| Method | Description |
|---|---|
| `login(username, password)` | Validates credentials, issues token pair, stores refresh hash |
| `refresh(refreshToken)` | Validates + rotates tokens, updates stored hash |
| `logout(refreshToken)` | Clears stored hash for the given token |
| `logoutAll(userId)` | Clears stored hash entirely |

### Users SubModule (`auth/users/`)
Provides user CRUD. Admin-only for create/delete. Authenticated users can update their own profile. Supports pagination and role-based filtering.

---

## Diagnostics (`src/modules/diagnostics/`)

### MedicalSessionModule

The central diagnostic module. A `MedicalSession` is the container that links an animal, a veterinarian, a date, and all five exam types.

**Key service methods:**
- `create(dto)` — Creates a DRAFT session
- `findAll(query)` — Paginated list with full exam includes
- `findOne(id)` — Returns session with all nested exam data and prediction
- `update(id, dto)` — Update date, notes, status, veterinarianId
- `submit(id)` — The core action: builds feature vector, calls ML, stores result
- `delete(id)` — Hard delete

The `sessionInclude` constant defines all the Prisma nested includes needed to load a complete session. It is reused across `create`, `findAll`, `findOne`, `update`, and `submit` to keep the response shape consistent.

---

### ClinicalExamModule

Manages the physical examination record. Has the most fields of any exam (5 vitals + 23 FK lookups).

All lookups are resolved and returned as full objects (not just IDs) in the response. This means the client receives the bilingual name and numericValue of every selected lookup.

---

### BloodExamModule

40+ numeric fields covering:
- Whole blood morphology (erythrocytes, leukocytes, thrombocytes, hemoglobin, etc.)
- Blood serum chemistry (proteins, lipids, metabolites, bilirubin, minerals)
- Trace elements (copper, cobalt, manganese, zinc)
- Free-text `conclusion` field

---

### UrineExamModule / FecesExamModule

Mix of numeric fields and FK references to lookup tables. Lookups have `numericValue` for ML feature extraction.

---

### MucosaExamModule

One exam record per mucosa type (oral, nasal, ocular, vaginal). A session can have zero to four mucosa exam records. Each links to a `MucosaType` (identified by `numericValue` 0–3) and a `MucosaAppearance` lookup.

---

### AnomalyDetectionModule

Contains two services:

**`AnomalyDetectionService`** — Main service:
- `predict(dto)` — Direct prediction without session
- `getAlerts(query)` — Paginated alert list
- `updateAlert(id, dto)` — Status transitions (ACKNOWLEDGED, RESOLVED)
- `getHealthSummary(animalId)` — Aggregate health status
- `getAnimalTrend(query)` — Time-series parameter data

**`ReferenceRangeService`** — Admin management of normal ranges:
- CRUD for `ReferenceRange` records
- `checkAnomalies(params, animalTypeId)` — Core severity calculation used by prediction

See `docs/ML_AI.md` for the full anomaly detection algorithm.

---

### FeedbackModule

Records veterinarian feedback on AI predictions. Links `Prediction` → `VetProfile` → optionally `Disease` (the vet's suggested correct diagnosis).

Rating scale: 1 (very wrong) to 5 (correct). These records provide the labeled data for model retraining.

---

### Lookup Table Modules

Located throughout `diagnostics/`, these are thin CRUD modules for reference data:

| Module | Table | Used in |
|---|---|---|
| `urine-color` | `UrineColor` | UrineExam |
| `urine-smell` | `UrineSmell` | UrineExam |
| `urine-clarity` | `UrineClarity` | UrineExam |
| `urine-consistency` | `UrineConsistency` | UrineExam |
| `feces-color` | `FecesColor` | FecesExam |
| `feces-smell` | `FecesSmell` | FecesExam |
| `feces-consistency` | `FecesConsistency` | FecesExam |
| `feces-form` | `FecesForm` | FecesExam |
| `mucosa-appearance` | `MucosaAppearance` | MucosaExam |

Each record has `name: Json`, `numericValue: Int @unique`, and `animalTypeId: UUID` (ranges differ per animal species).

Clinical exam lookup tables (BodyType, SkinColor, LymphSize, etc.) follow the same pattern and are managed through their respective modules under `clinical-exam/`.

---

## Inventory (`src/modules/inventory/`)

### AnimalModule

The animal record is the root entity for all clinical activity.

Key service method: `findPredict(id)` — assembles the animal's latest exam data from all five tables in parallel using `Promise.all`, enabling quick re-submission to the ML model without creating a new session.

### AnimalTypeModule

Hierarchical species classification. Supports `parentId` for nested structures (e.g. Cattle → Dairy Cattle → Jersey). The `findAll` query supports filtering by `parentId` (including `parentId: null` for root-level types).

---

## Medical (`src/modules/medical/`)

### DiseaseModule / DiseaseCategoryModule

Catalog of diseases and their hierarchical categories. Used in `Feedback` records when a vet provides a corrected diagnosis.

### ProphylaxisModule

Records each prophylaxis event per animal. The `findLastByAnimalId(animalId)` method returns the most recent prophylaxis record, useful for scheduling and compliance checking.

Three-level hierarchy:
```
ProphylaxisItem (e.g. "Foot-and-mouth vaccine")
  └── ProphylaxisDetail (e.g. "Serotype A")
        └── Prophylaxis (event: animal X received this on date Y)
```

---

## Management (`src/modules/management/`)

### RegionModule / DistrictModule / VetStationModule

Geographic administrative data. Used for assigning users and animals to locations.

Hierarchy: `Region (Int PK) → District (UUID) → VetStation (UUID)`

`User.districtId` links a user to their operating district.

All names are bilingual JSONB. List endpoints support `search` across both Russian and Uzbek name fields simultaneously.

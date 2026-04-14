# Comprehensive Testing for Production Readiness

## Goal

Cover the entire vet-diagnostics-backend with e2e tests, update all existing unit/integration tests to match current code, fill unit test gaps, and complete the Bruno API collection. No hard deadline — comprehensive coverage.

## Current State

- **62 unit test files** across ~30 services (auth, inventory, management, medical, some diagnostics)
- **4 e2e test files**: app health check, auth, inventory, management
- **~60 controllers** total across all modules
- **Test infra**: factories (user, animal, region), auth helper, database cleanup utility
- **Bruno collection**: ~90 requests covering auth, health, inventory, management, medical, exam endpoints
- **Missing e2e**: medical, users, all diagnostics (exams, sessions, lookup tables, feedback, statistics, anomaly)
- **Missing unit tests**: ~34 services (mostly diagnostics lookup tables + medical-session, feedback, statistics, shared services)
- **Missing Bruno**: ~30 lookup table endpoints, users, animal-sex, statistics

## 1. Infrastructure & Test DB

### Docker Compose for Test DB

Add `docker-compose.test.yml`:
- PostgreSQL 16 on port `5433` (avoids dev DB conflict on `5432`)
- Database: `vet_diagnostics_test`
- Credentials: `postgres:postgres`
- Health check for readiness

Add package.json scripts:
- `test:e2e:db:up` — start test DB container
- `test:e2e:db:down` — stop test DB container
- `test:e2e:db:reset` — drop and recreate + migrate

### Update Test Configuration

**`test/jest-e2e.json`:**
- Add `moduleNameMapper` for `src/` path aliases (currently missing — imports would fail)
- Add `setupFilesAfterSetup` pointing to test setup

**`test/jest-setup.ts`:**
- Default `DATABASE_URL` to `postgresql://postgres:postgres@localhost:5433/vet_diagnostics_test`

### Shared E2E App Bootstrap

Create `test/utils/setup-app.ts`:
- Bootstraps NestJS app matching `main.ts` exactly:
  - `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, `transform`, `enableImplicitConversion`
  - `PrismaExceptionFilter` (currently missing from e2e tests)
- Returns `{ app, module }` for use in all e2e files
- All e2e tests import this instead of duplicating bootstrap logic

### Update `test/utils/database.ts`

Add cleanup for tables not currently covered:
- `AnimalSex`
- `MedicalSession`, `DiagnosticSession`, `AIPrediction`
- `VetFeedback`
- All lookup tables: `BodyType`, `BodyPosition`, `Constitution`, `Temperament`, `ObesityType`, `SkinColor`, `SkinElasticity`, `SkinHumidity`, `SkinPain`, `SkinSensitivity`, `SkinSmell`, `SkinSurface`, `SkinTemp`, `HairType`, `WoolType`, `DownType`, `FeatherType`, `LymphConsistency`, `LymphMobility`, `LymphPain`, `LymphShape`, `LymphSize`, `LymphSurface`, `LymphTemp`, `FecesForm`, `MucosaType`, `RumenFluidState`
- Anomaly tables: `AnomalyDetectionRule`, etc.

Correct dependency order: exams → sessions → animals → lookup tables → users → management.

## 2. E2E Tests

### Priority Order

1. **Auth** (update `test/auth.e2e-spec.ts`)
2. **Management** (update `test/management.e2e-spec.ts`)
3. **Inventory** (update `test/inventory.e2e-spec.ts`)
4. **Medical** (new `test/medical.e2e-spec.ts`)
5. **Users** (new `test/users.e2e-spec.ts`)
6. **Diagnostics exams** (new `test/diagnostics-exams.e2e-spec.ts`)
7. **Medical sessions** (new `test/medical-sessions.e2e-spec.ts`)
8. **Diagnostics lookup tables** (new `test/diagnostics-lookups.e2e-spec.ts`)
9. **Feedback** (new `test/feedback.e2e-spec.ts`)
10. **Statistics** (new `test/statistics.e2e-spec.ts`)
11. **Anomaly detection** (new `test/anomaly-detection.e2e-spec.ts`)

### Test Coverage Per Endpoint

Every CRUD endpoint gets:
- **Happy path**: create → list (verify in results) → get by id → update → delete → verify gone
- **Validation errors (400)**: missing required fields, invalid types, `forbidNonWhitelisted` rejects unknown fields
- **Not found (404)**: get/update/delete with non-existent UUID
- **Unauthorized (401)**: all protected endpoints without token
- **Conflict (409)**: duplicate unique constraint violations where applicable
- **Pagination**: verify `{ data: [], meta: { total, lastPage, currentPage, perPage, prev, next } }` shape
- **Search**: bilingual search via `?search=` hits both `ru` and `uz`

### Templated Lookup Table Tests

All ~30 lookup table endpoints share identical CRUD: `POST`, `GET /`, `GET /:id`, `PUT /:id`, `DELETE /:id` with `{ name: { ru, uz } }` body.

Create `test/utils/lookup-crud-tests.ts`:
```typescript
export function describeLookupCrud(
  routePath: string,       // e.g., 'body-types'
  sampleName: { ru: string; uz: string },
  updatedName: { ru: string; uz: string },
) {
  // Generates full describe block with:
  // - POST create → 201
  // - POST missing name → 400
  // - GET list → 200 with pagination
  // - GET list with search → filters correctly
  // - GET /:id → 200
  // - GET /:id not found → 404
  // - PUT /:id → 200
  // - DELETE /:id → 200
  // - DELETE /:id not found → 404
  // - All endpoints without auth → 401
}
```

Then `test/diagnostics-lookups.e2e-spec.ts` calls this for each lookup:
```typescript
describeLookupCrud('body-types', { ru: 'Нормальный', uz: 'Normal' }, ...);
describeLookupCrud('skin-colors', { ru: 'Бледный', uz: 'Oqish' }, ...);
// ... all 30
```

### New Factories

- `DiseaseFactory` — creates disease with auto-created `DiseaseCategory`
- `DiseaseCategoryFactory` — creates category with bilingual name
- `MedicalSessionFactory` — creates session with required animal + user references
- `ExamFactory` — generic factory that creates any exam type (clinical, blood, urine, feces, mucosa) with required foreign keys
- `LookupFactory` — generic factory for any `{ name: { ru, uz } }` table, parameterized by Prisma model name
- `ProphylaxisFactory` — creates prophylaxis with required animal + disease refs

### Updating Existing E2E Tests

**`test/auth.e2e-spec.ts`:**
- Use shared `setupApp()` instead of inline bootstrap
- Add role-based access tests (ADMIN-only endpoints)
- Add inactive user login rejection test
- Match current auth controller method signatures

**`test/inventory.e2e-spec.ts`:**
- Use shared `setupApp()`
- Add full CRUD for breeds, colors, animal-sex (currently only tests animals + animal-types partially)
- Add validation error tests
- Add search/pagination tests

**`test/management.e2e-spec.ts`:**
- Use shared `setupApp()`
- Add GET /:id, PUT, DELETE for regions, districts, vet-stations
- Add validation + not-found tests

**`test/app.e2e-spec.ts`:**
- Update to use health endpoint or remove if redundant

## 3. Unit Test Updates

### Strategy

**For each existing spec file (~62):**
1. Read the current service/controller implementation
2. Compare against the spec file
3. Fix: mismatched method signatures, renamed methods, changed return types, added/removed methods
4. Update mock structures to match current Prisma schema
5. Ensure `afterEach` has `jest.clearAllMocks()`

**Filling gaps — trivial CRUD services (~30):**

Create `test/utils/lookup-service-test.ts` — a test generator:
```typescript
export function describeLookupService(
  ServiceClass: any,
  prismaModelName: string,   // e.g., 'bodyType'
  sampleDto: object,
  sampleEntity: object,
) {
  // Generates describe block testing:
  // - create() calls prisma[model].create with correct args
  // - findAll() calls paginate with search OR filter
  // - findOne() calls findUniqueOrThrow
  // - update() calls prisma[model].update
  // - delete() calls prisma[model].delete
}
```

Each lookup service spec imports this and calls it with its specific class + data.

**Filling gaps — non-trivial services:**

Hand-written tests for:
- `MedicalSessionService` — session lifecycle: create, attach exams, submit, get with includes
- `FeedbackService` — create feedback, link to session/disease
- `StatisticsService` — aggregation queries, date range filtering
- `PaginationService` — page math edge cases (page 0, page beyond last, empty result set)
- `ImageService` — image path handling, resize logic
- `ExcelService` — import parsing, error handling

### Controller Tests

Same approach: templated for lookup controllers, hand-written for complex ones (auth, animals, medical-sessions, exams).

## 4. Bruno Collection Updates

### Missing Collections to Add

**`docs/bruno/users/`** (5 files):
- List Users, Get User, Create User, Update User, Delete User

**`docs/bruno/inventory/animal-sexes/`** (5 files):
- Create, List, Get, Update, Delete

**`docs/bruno/diagnostics/statistics/`** (4 files):
- Get Diseases By Animals — `GET /statistics/diseases`
- Get Diseases Chart — `GET /statistics/diseases/chart`
- Get Overview — `GET /statistics/overview`
- Get Monthly Trends — `GET /statistics/trends`
- All accept query params: `animalTypeId`, `startDate`, `endDate`

**30 lookup table folders** (5 files each = ~150 files):
All follow identical template:
- `Create <Name>.bru` — POST to `{{baseUrl}}/<route>` with `{ "name": { "ru": "...", "uz": "..." } }` + auth
- `List <Names>.bru` — GET to `{{baseUrl}}/<route>?page=1&limit=10` + auth
- `Get <Name>.bru` — GET to `{{baseUrl}}/<route>/:id` + auth
- `Update <Name>.bru` — PUT to `{{baseUrl}}/<route>/:id` with body + auth
- `Delete <Name>.bru` — DELETE to `{{baseUrl}}/<route>/:id` + auth

Lookup tables to cover:
- Body: `body-types`, `body-positions`, `constitutions`, `temperaments`, `obesity-types`
- Skin: `skin-colors`, `skin-elasticities`, `skin-humidities`, `skin-pains`, `skin-sensitivities`, `skin-smells`, `skin-surfaces`, `skin-temps`
- Hair/Wool: `hair-types`, `wool-types`, `down-types`, `feather-types`
- Lymph: `lymph-consistencies`, `lymph-mobilities`, `lymph-pains`, `lymph-shapes`, `lymph-sizes`, `lymph-surfaces`, `lymph-temps`
- Feces: `feces-colors`, `feces-consistencies`, `feces-forms`, `feces-smells`
- Urine: `urine-colors`, `urine-clarities`, `urine-consistencies`, `urine-smells`
- Mucosa: `mucosa-types`, `mucosa-appearances`
- Other: `rumen-fluid-states`

### Environment Update

Update `docs/bruno/environments/Local.bru`:
- Verify `baseUrl` matches dev server port from `.env.example` (`APPLICATION_PORT=3000`)
- Tokens should be placeholder variables that get set by Login request post-script

## 5. Execution Order

1. Infrastructure: docker-compose.test.yml, setup-app.ts, database.ts update, jest-e2e.json fix
2. New factories: disease, medical-session, exam, lookup, prophylaxis
3. Update existing e2e tests (auth, inventory, management) to use shared setup + match current code
4. Write new e2e tests in priority order (medical → users → exams → sessions → lookups → feedback → statistics → anomaly)
5. Update existing unit tests (~62 files) to match current implementations
6. Fill unit test gaps (templated lookups + hand-written complex services)
7. Add missing Bruno collections (users, animal-sex, statistics, all lookup tables)
8. Run full test suite, fix any failures
9. Manual verification with Bruno against running dev server

## 6. Success Criteria

- `yarn test` passes with zero failures
- `yarn test:e2e` passes against Docker test DB with zero failures
- Every controller endpoint has at least one e2e test hitting happy path
- Every service has a unit test file
- Bruno collection covers every endpoint in the API
- No stale test logic — all tests reflect current implementation

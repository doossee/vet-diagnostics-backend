# Comprehensive Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cover the entire vet-diagnostics-backend with e2e tests, update all existing unit tests to match current code, fill unit test gaps, and complete the Bruno API collection for production readiness.

**Architecture:** Top-down, critical-path-first. Infrastructure and shared utilities first, then e2e tests by business priority (auth → management → inventory → medical → exams → sessions → lookups), then unit test updates, then Bruno collection. Lookup tables (~30) use shared template utilities to avoid repetition.

**Tech Stack:** NestJS 11, Jest 30, supertest, ts-jest, Docker Compose (PostgreSQL 16), Bruno API client, Prisma 7.5

**Spec:** `docs/superpowers/specs/2026-04-14-comprehensive-testing-design.md`

---

## Task 1: Docker Test DB Infrastructure

**Files:**
- Create: `docker-compose.test.yml`
- Modify: `package.json` (add scripts)
- Modify: `test/jest-setup.ts` (update default port)
- Modify: `test/jest-e2e.json` (add moduleNameMapper, setupFilesAfterSetup)
- Modify: `test/utils/database.ts` (update default port)

- [ ] **Step 1: Create `docker-compose.test.yml`**

```yaml
version: '3.8'
services:
  test-db:
    image: postgres:16-alpine
    container_name: vet-diagnostics-test-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: vet_diagnostics_test
    ports:
      - '5433:5432'
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 5s
      retries: 5
    tmpfs:
      - /var/lib/postgresql/data
```

- [ ] **Step 2: Add scripts to `package.json`**

Add to `"scripts"`:
```json
"test:e2e:db:up": "docker compose -f docker-compose.test.yml up -d --wait",
"test:e2e:db:down": "docker compose -f docker-compose.test.yml down",
"test:e2e:db:reset": "docker compose -f docker-compose.test.yml down -v && docker compose -f docker-compose.test.yml up -d --wait && DATABASE_URL=postgresql://postgres:postgres@localhost:5433/vet_diagnostics_test npx prisma migrate deploy --schema prisma/schema/schema.prisma",
"test:e2e:run": "DATABASE_URL=postgresql://postgres:postgres@localhost:5433/vet_diagnostics_test jest --config ./test/jest-e2e.json --runInBand"
```

- [ ] **Step 3: Update `test/jest-e2e.json`**

Replace with:
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "moduleNameMapper": {
    "^src/(.*)$": "<rootDir>/../src/$1"
  },
  "setupFilesAfterSetup": ["<rootDir>/jest-setup.ts"]
}
```

- [ ] **Step 4: Update default DATABASE_URL in `test/jest-setup.ts`**

Change the default connection string port from `5432` to `5433`:
```typescript
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://postgres:postgres@localhost:5433/vet_diagnostics_test?schema=public';
}
```

- [ ] **Step 5: Verify Docker test DB starts and migrations run**

Run:
```bash
yarn test:e2e:db:up
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/vet_diagnostics_test npx prisma migrate deploy --schema prisma/schema/schema.prisma
```
Expected: Container starts, migrations succeed.

- [ ] **Step 6: Commit**

```bash
git add docker-compose.test.yml package.json test/jest-setup.ts test/jest-e2e.json
git commit -m "infra: add Docker test DB and update e2e test config"
```

---

## Task 2: Shared E2E Utilities

**Files:**
- Create: `test/utils/setup-app.ts`
- Modify: `test/utils/database.ts` (add missing table cleanups)

- [ ] **Step 1: Create `test/utils/setup-app.ts`**

This must match `src/main.ts` bootstrap exactly:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { CoreModule } from '../../src/core/core.module';
import { PrismaExceptionFilter } from '../../src/shared/filters';

export async function setupApp(): Promise<{
  app: INestApplication<App>;
  module: TestingModule;
}> {
  const module = await Test.createTestingModule({
    imports: [CoreModule],
  }).compile();

  const app = module.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());

  await app.init();

  return { app, module };
}
```

- [ ] **Step 2: Update `test/utils/database.ts` cleanup**

Add all missing tables to `cleanupDatabase()`. The function must delete in reverse dependency order. Read the current Prisma schema files to identify every model, then rewrite `cleanupDatabase()` to cover them all. Key additions:
- `AIPrediction`, `DiagnosticSession`, `VetFeedback`
- `MedicalSession`
- `AnimalSex`
- All lookup tables: `BodyType`, `BodyPosition`, `Constitution`, `Temperament`, `ObesityType`, all `Skin*`, all `Lymph*`, `HairType`, `WoolType`, `DownType`, `FeatherType`, `FecesForm`, `MucosaType`, `RumenFluidState`
- Anomaly tables: `AnomalyAlert`, `AnomalyDetectionRule` (if they exist in schema)

Read every `prisma/schema/*.prisma` file to get the exact model names and dependency order.

- [ ] **Step 3: Run existing e2e tests to verify utilities work**

```bash
yarn test:e2e:run
```
Expected: Existing tests still pass (they'll use the shared DB now).

- [ ] **Step 4: Commit**

```bash
git add test/utils/setup-app.ts test/utils/database.ts
git commit -m "test: add shared e2e app setup and expand database cleanup"
```

---

## Task 3: New Test Factories

**Files:**
- Create: `test/factories/disease.factory.ts`
- Create: `test/factories/medical-session.factory.ts`
- Create: `test/factories/exam.factory.ts`
- Create: `test/factories/lookup.factory.ts`
- Create: `test/factories/prophylaxis.factory.ts`
- Create: `test/factories/index.ts` (barrel export)

- [ ] **Step 1: Create `test/factories/lookup.factory.ts`**

Generic factory for any `{ name: { ru, uz } }` table:

```typescript
import { getPrismaTestClient } from '../utils/database';

export class LookupFactory {
  private prisma = getPrismaTestClient();

  async create(
    modelName: string,
    overrides?: { name?: { ru: string; uz: string }; numericValue?: number },
  ) {
    const data: any = {
      name: overrides?.name || {
        ru: `Тест_${Date.now()}`,
        uz: `Test_${Date.now()}`,
      },
    };
    if (overrides?.numericValue !== undefined) {
      data.numericValue = overrides.numericValue;
    }
    return (this.prisma as any)[modelName].create({ data });
  }
}
```

- [ ] **Step 2: Create `test/factories/disease.factory.ts`**

```typescript
import { getPrismaTestClient } from '../utils/database';
import { Prisma } from '../../src/generated/prisma/client';

export class DiseaseCategoryFactory {
  private prisma = getPrismaTestClient();

  async create(overrides?: { name?: { ru: string; uz: string } }) {
    return this.prisma.diseaseCategory.create({
      data: {
        name: (overrides?.name || {
          ru: `Категория_${Date.now()}`,
          uz: `Kategoriya_${Date.now()}`,
        }) as unknown as Prisma.InputJsonValue,
      },
    });
  }
}

export class DiseaseFactory {
  private prisma = getPrismaTestClient();
  private categoryFactory = new DiseaseCategoryFactory();

  async create(overrides?: {
    name?: { ru: string; uz: string };
    diseaseCategoryId?: string;
  }) {
    const categoryId =
      overrides?.diseaseCategoryId ||
      (await this.categoryFactory.create()).id;

    return this.prisma.disease.create({
      data: {
        name: (overrides?.name || {
          ru: `Болезнь_${Date.now()}`,
          uz: `Kasallik_${Date.now()}`,
        }) as unknown as Prisma.InputJsonValue,
        diseaseCategoryId: categoryId,
      },
    });
  }
}
```

- [ ] **Step 3: Create `test/factories/medical-session.factory.ts`**

Read `src/modules/diagnostics/medical-session/medical-session.service.ts` and `prisma/schema/session.prisma` to understand required fields. Create factory that auto-creates required animal + user dependencies.

- [ ] **Step 4: Create `test/factories/exam.factory.ts`**

Read `prisma/schema/blood-exam.prisma`, `clinical-exam.prisma`, `urine-exam.prisma`, `feces-exam.prisma`, `mucosa-exam.prisma` for required fields. Create factory classes: `BloodExamFactory`, `ClinicalExamFactory`, `UrineExamFactory`, `FecesExamFactory`, `MucosaExamFactory`. Each auto-creates required session + animal refs.

- [ ] **Step 5: Create `test/factories/prophylaxis.factory.ts`**

Read `prisma/schema/medical.prisma` for Prophylaxis model fields. Create `ProphylaxisFactory`, `ProphylaxisItemFactory`, `ProphylaxisDetailFactory`.

- [ ] **Step 6: Create `test/factories/index.ts`**

Barrel export all factories.

- [ ] **Step 7: Commit**

```bash
git add test/factories/
git commit -m "test: add factories for diseases, sessions, exams, lookups, prophylaxis"
```

---

## Task 4: Update Auth E2E Tests

**Files:**
- Modify: `test/auth.e2e-spec.ts`

- [ ] **Step 1: Read current auth controller and service**

Read `src/auth/auth.controller.ts` and `src/auth/auth.service.ts` completely. Compare every endpoint against what's currently tested in `test/auth.e2e-spec.ts`. Identify new/changed endpoints.

- [ ] **Step 2: Rewrite `test/auth.e2e-spec.ts`**

Replace the entire file. Use `setupApp()` from `test/utils/setup-app.ts`. Test every endpoint on the auth controller:
- `POST /auth/login` — valid creds (200), invalid username (401), invalid password (401), missing fields (400), inactive user (401)
- `POST /auth/refresh` — valid token (200), invalid token (401), expired token (401)
- `POST /auth/logout` — with token (200), without token (401)
- `GET /auth/me` — with token (200, verify user shape), without token (401), invalid token (401)

Each test uses factories for data setup and `cleanupDatabase()` in `afterEach`.

- [ ] **Step 3: Run auth e2e tests**

```bash
yarn test:e2e:run -- --testPathPattern=auth
```
Expected: All pass.

- [ ] **Step 4: Commit**

```bash
git add test/auth.e2e-spec.ts
git commit -m "test: update auth e2e tests to match current implementation"
```

---

## Task 5: Update Management E2E Tests

**Files:**
- Modify: `test/management.e2e-spec.ts`

- [ ] **Step 1: Read current management controllers**

Read `src/modules/management/region/region.controller.ts`, `district/district.controller.ts`, `vet-station/vet-station.controller.ts` and their services. Note every endpoint, method signature, and DTO shape.

- [ ] **Step 2: Rewrite `test/management.e2e-spec.ts`**

Replace entirely. Use `setupApp()`. For each of regions, districts, vet-stations, test full CRUD:
- `POST` — create with valid data (201), validation error (400), duplicate (409 if applicable)
- `GET /` — paginated list (200), verify meta shape, search filter
- `GET /:id` — found (200), not found (404)
- `PATCH /:id` or `PUT /:id` — update (200), not found (404), validation error (400)
- `DELETE /:id` — delete (200), not found (404)
- All without auth → 401

Check whether the controllers use `@Patch` or `@Put` and use the matching HTTP method in tests.

- [ ] **Step 3: Run management e2e tests**

```bash
yarn test:e2e:run -- --testPathPattern=management
```
Expected: All pass.

- [ ] **Step 4: Commit**

```bash
git add test/management.e2e-spec.ts
git commit -m "test: update management e2e tests with full CRUD coverage"
```

---

## Task 6: Update Inventory E2E Tests

**Files:**
- Modify: `test/inventory.e2e-spec.ts`

- [ ] **Step 1: Read all inventory controllers**

Read controllers and services for: `animal`, `animal-type`, `animal-breed`, `animal-color`, `animal-sex`. Note all endpoints and DTO shapes.

- [ ] **Step 2: Rewrite `test/inventory.e2e-spec.ts`**

Replace entirely. Use `setupApp()`. Full CRUD tests for each:
- `animal-types` — CRUD + resolve endpoint
- `breeds` — CRUD (note: may have `animalTypeId` foreign key)
- `colors` — CRUD with bilingual names
- `animal-sexes` — CRUD with bilingual names
- `animals` — CRUD (requires animalTypeId, animalBreedId, animalColorId foreign keys; use factories)

- [ ] **Step 3: Run inventory e2e tests**

```bash
yarn test:e2e:run -- --testPathPattern=inventory
```
Expected: All pass.

- [ ] **Step 4: Commit**

```bash
git add test/inventory.e2e-spec.ts
git commit -m "test: update inventory e2e tests with all endpoints"
```

---

## Task 7: New Medical E2E Tests

**Files:**
- Create: `test/medical.e2e-spec.ts`

- [ ] **Step 1: Read all medical controllers and services**

Read controllers for: `disease-category`, `disease`, `prophylaxis`, `prophylaxis-item`, `prophylaxis-detail`. Note endpoints, DTO shapes, required foreign keys.

- [ ] **Step 2: Write `test/medical.e2e-spec.ts`**

Use `setupApp()`. Full CRUD for each:
- `disease-categories` — CRUD with bilingual names
- `diseases` — CRUD with `diseaseCategoryId` FK, search across both languages
- `prophylaxis` — CRUD with animal + disease FK refs, get-last-for-animal
- `prophylaxis-items` — CRUD
- `prophylaxis-details` — CRUD

Use `DiseaseCategoryFactory`, `DiseaseFactory` for test data setup.

- [ ] **Step 3: Run medical e2e tests**

```bash
yarn test:e2e:run -- --testPathPattern=medical
```
Expected: All pass.

- [ ] **Step 4: Commit**

```bash
git add test/medical.e2e-spec.ts
git commit -m "test: add medical module e2e tests"
```

---

## Task 8: New Users E2E Tests

**Files:**
- Create: `test/users.e2e-spec.ts`

- [ ] **Step 1: Read users controller and service**

Read `src/auth/users/users.controller.ts` and `src/auth/users/users.service.ts`. Note all endpoints:
- `POST /users` — create staff user
- `GET /users` — list (admin only)
- `GET /users/me` — current user profile
- `PUT /users/me` — update own profile
- `PATCH /users/me/password` — change own password
- `GET /users/:id` — get by ID (admin)
- `PUT /users/:id` — update user (admin)
- `DELETE /users/:id` — soft delete (admin)
- `PATCH /users/:id/password` — admin change password

Verify exact decorators and route paths.

- [ ] **Step 2: Write `test/users.e2e-spec.ts`**

Use `setupApp()`. Test:
- CRUD operations with correct auth
- Role-based access (admin-only endpoints with non-admin token → 403)
- Password change (old password validation)
- Soft delete behavior
- Profile update

- [ ] **Step 3: Run users e2e tests**

```bash
yarn test:e2e:run -- --testPathPattern=users
```
Expected: All pass.

- [ ] **Step 4: Commit**

```bash
git add test/users.e2e-spec.ts
git commit -m "test: add users e2e tests with role-based access"
```

---

## Task 9: New Diagnostics Exams E2E Tests

**Files:**
- Create: `test/diagnostics-exams.e2e-spec.ts`

- [ ] **Step 1: Read all 5 exam controllers and services**

Read controllers and services for: `blood-exam`, `clinical-exam`, `urine-exam`, `feces-exam`, `mucosa-exam`. Note every endpoint, DTO shapes, required FKs (animalId, sessionId).

- [ ] **Step 2: Write `test/diagnostics-exams.e2e-spec.ts`**

Use `setupApp()`. For each exam type, test:
- `POST /<exams>` — create with valid data (201), missing required fields (400)
- `GET /<exams>` — paginated list (200), filter by animalId
- `GET /<exams>/:id` — found (200), not found (404)
- `PATCH /<exams>/:id` — update (200)
- `GET /<exams>/last/:animalId` — get last exam for animal
- `DELETE /<exams>/:id` — delete (200)
- All without auth → 401

Use `ExamFactory` subclasses + `AnimalFactory` for test data.

- [ ] **Step 3: Run diagnostics exams e2e tests**

```bash
yarn test:e2e:run -- --testPathPattern=diagnostics-exams
```
Expected: All pass.

- [ ] **Step 4: Commit**

```bash
git add test/diagnostics-exams.e2e-spec.ts
git commit -m "test: add diagnostics exam e2e tests (blood, clinical, urine, feces, mucosa)"
```

---

## Task 10: New Medical Sessions E2E Tests

**Files:**
- Create: `test/medical-sessions.e2e-spec.ts`

- [ ] **Step 1: Read medical-session controller and service**

Read `src/modules/diagnostics/medical-session/medical-session.controller.ts` and service. Note all endpoints:
- `POST /medical-sessions` — create
- `GET /medical-sessions` — list with filters (animalId, vetId, status, examType)
- `GET /medical-sessions/:id` — get with all exam includes
- `PATCH /medical-sessions/:id` — update
- `POST /medical-sessions/:id/submit` — submit for AI prediction
- `GET /medical-sessions/:id/predict` — get prediction
- `DELETE /medical-sessions/:id` — delete

- [ ] **Step 2: Write `test/medical-sessions.e2e-spec.ts`**

Use `setupApp()`. Test:
- Full CRUD lifecycle
- Filter tests (by animal, by status)
- Submit endpoint (will fail if PREDICT_API_URI is not set — test that it returns appropriate error or mock the external service)
- Pagination on list

Use `MedicalSessionFactory` for test data.

- [ ] **Step 3: Run medical sessions e2e tests**

```bash
yarn test:e2e:run -- --testPathPattern=medical-sessions
```
Expected: All pass (submit/predict may need external service mocking).

- [ ] **Step 4: Commit**

```bash
git add test/medical-sessions.e2e-spec.ts
git commit -m "test: add medical session e2e tests"
```

---

## Task 11: Lookup Table E2E Tests (All ~30)

**Files:**
- Create: `test/utils/lookup-e2e-tests.ts` (shared test generator)
- Create: `test/diagnostics-lookups.e2e-spec.ts`

- [ ] **Step 1: Create `test/utils/lookup-e2e-tests.ts`**

A function that generates a full describe block for any lookup CRUD endpoint:

```typescript
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

export function describeLookupCrud(
  getApp: () => INestApplication<App>,
  getToken: () => string,
  routePath: string,
  sampleData: { name: { ru: string; uz: string }; numericValue?: number },
  updatedData: { name: { ru: string; uz: string }; numericValue?: number },
) {
  describe(`/${routePath}`, () => {
    let createdId: string;

    it(`POST /${routePath} - should create`, async () => {
      const res = await request(getApp().getHttpServer())
        .post(`/${routePath}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .send(sampleData)
        .expect(201);
      expect(res.body).toHaveProperty('id');
      createdId = res.body.id;
    });

    it(`GET /${routePath} - should list with pagination`, async () => {
      const res = await request(getApp().getHttpServer())
        .get(`/${routePath}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it(`GET /${routePath}?search= - should search bilingual`, async () => {
      const res = await request(getApp().getHttpServer())
        .get(`/${routePath}?search=${encodeURIComponent(sampleData.name.ru)}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it(`GET /${routePath}/:id - should get by id`, async () => {
      const res = await request(getApp().getHttpServer())
        .get(`/${routePath}/${createdId}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(200);
      expect(res.body.id).toBe(createdId);
    });

    it(`GET /${routePath}/:id - should 404 for not found`, async () => {
      await request(getApp().getHttpServer())
        .get(`/${routePath}/00000000-0000-0000-0000-000000000000`)
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(404);
    });

    it(`PATCH /${routePath}/:id - should update`, async () => {
      const res = await request(getApp().getHttpServer())
        .patch(`/${routePath}/${createdId}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .send(updatedData)
        .expect(200);
      expect(res.body.id).toBe(createdId);
    });

    it(`DELETE /${routePath}/:id - should delete`, async () => {
      await request(getApp().getHttpServer())
        .delete(`/${routePath}/${createdId}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .expect(200);
    });

    it(`POST /${routePath} - should 401 without auth`, async () => {
      await request(getApp().getHttpServer())
        .post(`/${routePath}`)
        .send(sampleData)
        .expect(401);
    });

    it(`POST /${routePath} - should 400 for invalid data`, async () => {
      await request(getApp().getHttpServer())
        .post(`/${routePath}`)
        .set('Authorization', `Bearer ${getToken()}`)
        .send({})
        .expect(400);
    });
  });
}
```

- [ ] **Step 2: Create `test/diagnostics-lookups.e2e-spec.ts`**

Uses `setupApp()` and `describeLookupCrud()` for every lookup endpoint. Read each lookup controller to verify the exact route path (from `@Controller(...)` decorator) and whether the DTO has `numericValue` or just `name`.

The lookups to cover (verify route from each controller):
- `body-types`, `body-positions`, `constitutions`, `temperaments`, `obesity-types`
- `skin-colors`, `skin-elasticities`, `skin-humidities`, `skin-pains`, `skin-sensitivities`, `skin-smells`, `skin-surfaces`, `skin-temps`
- `hair-types`, `wool-types`, `down-types`, `feather-types`
- `lymph-consistencies`, `lymph-mobilities`, `lymph-pains`, `lymph-shapes`, `lymph-sizes`, `lymph-surfaces`, `lymph-temps`
- `feces-colors`, `feces-consistencies`, `feces-forms`, `feces-smells`
- `urine-colors`, `urine-clarities`, `urine-consistencies`, `urine-smells`
- `mucosa-types`, `mucosa-appearances`
- `rumen-fluid-states`

Structure:
```typescript
import { setupApp } from './utils/setup-app';
import { describeLookupCrud } from './utils/lookup-e2e-tests';
// ... factories, cleanup

describe('Diagnostics Lookups (e2e)', () => {
  // shared setup: app, auth token, beforeAll/afterAll

  describeLookupCrud(
    () => app, () => accessToken,
    'body-types',
    { name: { ru: 'Нормальный', uz: 'Normal' }, numericValue: 1 },
    { name: { ru: 'Обновлённый', uz: 'Yangilangan' }, numericValue: 2 },
  );

  describeLookupCrud(
    () => app, () => accessToken,
    'body-positions',
    { name: { ru: 'Стоячее', uz: 'Tik turish' }, numericValue: 1 },
    { name: { ru: 'Лежачее', uz: 'Yotish' }, numericValue: 2 },
  );

  // ... repeat for all ~30 lookups
});
```

- [ ] **Step 3: Run lookup e2e tests**

```bash
yarn test:e2e:run -- --testPathPattern=diagnostics-lookups
```
Expected: All pass.

- [ ] **Step 4: Commit**

```bash
git add test/utils/lookup-e2e-tests.ts test/diagnostics-lookups.e2e-spec.ts
git commit -m "test: add e2e tests for all ~30 diagnostic lookup endpoints"
```

---

## Task 12: New Feedback E2E Tests

**Files:**
- Create: `test/feedback.e2e-spec.ts`

- [ ] **Step 1: Read feedback controller and service**

Read `src/modules/diagnostics/feedback/feedback.controller.ts` and service. Note all endpoints and DTO shapes including required FKs (`predictionId`, `veterinarianId`, etc.).

- [ ] **Step 2: Write `test/feedback.e2e-spec.ts`**

Use `setupApp()`. Test full CRUD:
- Create feedback with prediction/veterinarian refs
- List with filters
- Get by ID
- Update
- Delete
- Auth checks

- [ ] **Step 3: Run and commit**

```bash
yarn test:e2e:run -- --testPathPattern=feedback
git add test/feedback.e2e-spec.ts
git commit -m "test: add feedback e2e tests"
```

---

## Task 13: New Statistics E2E Tests

**Files:**
- Create: `test/statistics.e2e-spec.ts`

- [ ] **Step 1: Read statistics controller**

Endpoints (from prior analysis):
- `GET /statistics/diseases` — disease counts by animal
- `GET /statistics/diseases/chart` — disease frequency chart data
- `GET /statistics/overview` — dashboard overview
- `GET /statistics/trends` — monthly trends

All accept query params: `animalTypeId`, `startDate`, `endDate`.

- [ ] **Step 2: Write `test/statistics.e2e-spec.ts`**

Use `setupApp()`. Test:
- Each endpoint returns 200 with correct shape (even if empty data)
- Filter by date range
- Filter by animalTypeId
- Without auth → 401

Statistics may return empty results if no sessions exist — that's fine, verify the response shape.

- [ ] **Step 3: Run and commit**

```bash
yarn test:e2e:run -- --testPathPattern=statistics
git add test/statistics.e2e-spec.ts
git commit -m "test: add statistics e2e tests"
```

---

## Task 14: New Anomaly Detection E2E Tests

**Files:**
- Create: `test/anomaly-detection.e2e-spec.ts`

- [ ] **Step 1: Read anomaly-detection controller**

Read `src/modules/diagnostics/anomaly-detection/anomaly-detection.controller.ts`. Note there are two controllers in the file: one for `anomaly-detection` and one for `reference-ranges`.

- [ ] **Step 2: Write `test/anomaly-detection.e2e-spec.ts`**

Use `setupApp()`. Test both controllers:
- Anomaly detection endpoints (alerts, trends, health summary, predict)
- Reference ranges CRUD

- [ ] **Step 3: Run and commit**

```bash
yarn test:e2e:run -- --testPathPattern=anomaly-detection
git add test/anomaly-detection.e2e-spec.ts
git commit -m "test: add anomaly detection and reference ranges e2e tests"
```

---

## Task 15: Run Full E2E Suite

- [ ] **Step 1: Run all e2e tests together**

```bash
yarn test:e2e:run
```
Expected: All pass. Fix any failures due to test isolation issues (shared state, cleanup order).

- [ ] **Step 2: Commit any fixes**

```bash
git add -A
git commit -m "test: fix e2e test isolation issues"
```

---

## Task 16: Update Existing Unit Tests

**Files:**
- Modify: All ~62 existing `*.spec.ts` files

- [ ] **Step 1: For each existing spec file, read the current service/controller implementation and compare against the test**

For each module in `src/`:
1. Read the `.service.ts` — note all method signatures, parameters, return types
2. Read the `.spec.ts` — note what's tested, what mock shapes are used
3. If methods were added/removed/renamed, update the spec
4. If DTO shapes changed, update mock data
5. If include/where clauses changed, update mock assertions
6. Ensure `afterEach(() => jest.clearAllMocks())` is present

Key patterns to check:
- Services now use `name as unknown as Prisma.InputJsonValue` — mocks should match
- Some services gained `importFromExcel()` — add test or skip (excel tests are low priority)
- Some services gained `findLastByAnimalId()` — add test
- Pagination mock should return `{ data, meta }` shape

Work through modules in this order: auth, inventory, management, medical, diagnostics (exams first, then lookups that already have tests).

- [ ] **Step 2: Run all unit tests**

```bash
yarn test
```
Expected: All pass. Fix any failures.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "test: update all existing unit tests to match current implementations"
```

---

## Task 17: Fill Unit Test Gaps — Lookup Services

**Files:**
- Create: ~30 new `*.spec.ts` files for untested lookup services

- [ ] **Step 1: For each untested lookup service, create a spec file**

Every lookup service follows the identical pattern (see `mucosa-appearance.service.spec.ts` as the template). For each, create a spec that tests: `create`, `findAll` (via pagination mock), `findOne`, `update`, `delete`.

The Prisma model name in the mock must match the service's `this.prisma.<modelName>` usage. Read each service file to get the exact model name.

Services to cover:
- `body-type`, `body-position`, `constitution`, `temperament`, `obesity-type`
- `skin-color`, `skin-elasticity`, `skin-humidity`, `skin-pain`, `skin-sensitivity`, `skin-smell`, `skin-surface`, `skin-temp`
- `hair-type`, `wool-type`, `down-type`, `feather-type`
- `lymph-consistency`, `lymph-mobility`, `lymph-pain`, `lymph-shape`, `lymph-size`, `lymph-surface`, `lymph-temp`
- `feces-form`
- `mucosa-type`
- `rumen-fluid-state`
- `animal-sex`

For each, the spec structure is:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { <ServiceName> } from './<service-name>.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PaginationService } from 'src/shared/services';

describe('<ServiceName>', () => {
  let service: <ServiceName>;

  const mockPrismaService = {
    <prismaModelName>: {
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockPaginationService = { paginate: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        <ServiceName>,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PaginationService, useValue: mockPaginationService },
      ],
    }).compile();
    service = module.get<<ServiceName>>(<ServiceName>);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a record', async () => {
      const dto = { name: { ru: 'Тест', uz: 'Test' }, numericValue: 1 };
      const mock = { id: 'uuid', ...dto };
      mockPrismaService.<prismaModelName>.create.mockResolvedValue(mock);
      expect(await service.create(dto as any)).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return a record', async () => {
      const mock = { id: 'uuid', name: { ru: 'Тест', uz: 'Test' } };
      mockPrismaService.<prismaModelName>.findUniqueOrThrow.mockResolvedValue(mock);
      expect(await service.findOne('uuid')).toEqual(mock);
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const dto = { name: { ru: 'Обновлено', uz: 'Updated' } };
      const mock = { id: 'uuid', ...dto };
      mockPrismaService.<prismaModelName>.update.mockResolvedValue(mock);
      expect(await service.update('uuid', dto as any)).toEqual(mock);
    });
  });

  describe('delete', () => {
    it('should delete a record', async () => {
      const mock = { id: 'uuid' };
      mockPrismaService.<prismaModelName>.delete.mockResolvedValue(mock);
      expect(await service.delete('uuid')).toEqual(mock);
    });
  });

  describe('findAll', () => {
    it('should return paginated results', async () => {
      const mockResult = { data: [], meta: { total: 0, currentPage: 1, perPage: 10, lastPage: 0, prev: null, next: null } };
      mockPaginationService.paginate.mockResolvedValue(mockResult);
      expect(await service.findAll({ page: 1, perPage: 10 } as any)).toEqual(mockResult);
    });
  });
});
```

Read each service to get the exact `prismaModelName` (camelCase of the model, e.g., `bodyType`, `skinColor`, `lymphConsistency`).

- [ ] **Step 2: Run all unit tests**

```bash
yarn test
```
Expected: All pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "test: add unit tests for all lookup services"
```

---

## Task 18: Fill Unit Test Gaps — Complex Services

**Files:**
- Create: `src/modules/diagnostics/medical-session/medical-session.service.spec.ts`
- Create: `src/modules/diagnostics/feedback/feedback.service.spec.ts`
- Create: `src/modules/diagnostics/statistics/statistics.service.spec.ts`
- Create: `src/shared/services/pagination.service.spec.ts`

- [ ] **Step 1: Write `medical-session.service.spec.ts`**

Read the service completely. Test:
- `create()` — creates session with correct data
- `findAll()` — pagination with filters (animalId, status)
- `findOne()` — returns session with all includes
- `update()` — updates session
- `submit()` — builds feature vector, calls prediction API (mock axios)
- `delete()` — deletes session

Mock `PrismaService`, `PaginationService`, and `axios` (for prediction API).

- [ ] **Step 2: Write `feedback.service.spec.ts`**

Read the service. Test CRUD operations with mocked Prisma. Verify correct include relations.

- [ ] **Step 3: Write `statistics.service.spec.ts`**

Read the service. Test:
- `getDiseasesByAnimals()` — verify aggregation logic
- `getDiseasesChart()` — verify sorting
- `getOverview()` — verify dashboard shape
- `getMonthlyTrends()` — verify grouping

Mock `PrismaService` with `findMany`, `count`, `groupBy` as needed.

- [ ] **Step 4: Write `pagination.service.spec.ts`**

Test:
- Normal pagination (page 1, 2, etc.)
- Empty result set
- Single page (total < perPage)
- Meta calculations (prev/next/lastPage)

- [ ] **Step 5: Run all unit tests**

```bash
yarn test
```
Expected: All pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test: add unit tests for medical-session, feedback, statistics, pagination"
```

---

## Task 19: Bruno Collection — Users, Animal-Sex, Statistics

**Files:**
- Create: `docs/bruno/users/` (5 `.bru` files)
- Create: `docs/bruno/inventory/animal-sexes/` (5 `.bru` files)
- Create: `docs/bruno/diagnostics/statistics/` (4 `.bru` files)

- [ ] **Step 1: Read `src/auth/users/users.controller.ts` for exact endpoints**

Note HTTP methods, paths, and expected request bodies.

- [ ] **Step 2: Create Bruno files for users**

Create 5 files following the existing Bruno pattern (see `docs/bruno/management/regions/` for template):
- `Create User.bru` — POST to `{{baseUrl}}/users`
- `List Users.bru` — GET to `{{baseUrl}}/users`
- `Get User.bru` — GET to `{{baseUrl}}/users/:id`
- `Update User.bru` — PUT to `{{baseUrl}}/users/:id`
- `Delete User.bru` — DELETE to `{{baseUrl}}/users/:id`

Each file uses `auth:bearer` with `{{accessToken}}`.

- [ ] **Step 3: Create Bruno files for animal-sexes**

5 files: Create, List, Get, Update, Delete for `/animal-sexes`.

- [ ] **Step 4: Create Bruno files for statistics**

4 files:
- `Get Diseases By Animals.bru` — GET `{{baseUrl}}/statistics/diseases`
- `Get Diseases Chart.bru` — GET `{{baseUrl}}/statistics/diseases/chart`
- `Get Overview.bru` — GET `{{baseUrl}}/statistics/overview`
- `Get Monthly Trends.bru` — GET `{{baseUrl}}/statistics/trends`

Each with query params: `animalTypeId`, `startDate`, `endDate`.

- [ ] **Step 5: Commit**

```bash
git add docs/bruno/
git commit -m "docs: add Bruno collections for users, animal-sexes, statistics"
```

---

## Task 20: Bruno Collection — All Lookup Tables

**Files:**
- Create: 30 folders under `docs/bruno/diagnostics/` with 5 `.bru` files each (~150 files)

- [ ] **Step 1: Read an existing Bruno lookup file for the pattern**

Read `docs/bruno/diagnostics/blood-exams/Create Blood Exam.bru` or any existing CRUD `.bru` file to see the exact format.

- [ ] **Step 2: Create Bruno files for all lookup tables**

For each of the ~30 lookup endpoints, create a folder under `docs/bruno/diagnostics/` with 5 files: `Create <Name>.bru`, `List <Names>.bru`, `Get <Name>.bru`, `Update <Name>.bru`, `Delete <Name>.bru`.

Each Create/Update `.bru` file body:
```json
{
  "name": {
    "ru": "Пример",
    "uz": "Namuna"
  },
  "numericValue": 1
}
```
(Omit `numericValue` if the DTO doesn't include it — check each controller's create DTO.)

Folders to create:
- `body-types`, `body-positions`, `constitutions`, `temperaments`, `obesity-types`
- `skin-colors`, `skin-elasticities`, `skin-humidities`, `skin-pains`, `skin-sensitivities`, `skin-smells`, `skin-surfaces`, `skin-temps`
- `hair-types`, `wool-types`, `down-types`, `feather-types`
- `lymph-consistencies`, `lymph-mobilities`, `lymph-pains`, `lymph-shapes`, `lymph-sizes`, `lymph-surfaces`, `lymph-temps`
- `feces-colors`, `feces-consistencies`, `feces-forms`, `feces-smells`
- `urine-colors`, `urine-clarities`, `urine-consistencies`, `urine-smells`
- `mucosa-types`, `mucosa-appearances`
- `rumen-fluid-states`

- [ ] **Step 3: Commit**

```bash
git add docs/bruno/
git commit -m "docs: add Bruno collections for all diagnostic lookup endpoints"
```

---

## Task 21: Final Verification

- [ ] **Step 1: Run full unit test suite**

```bash
yarn test
```
Expected: All pass, zero failures.

- [ ] **Step 2: Run full e2e test suite**

```bash
yarn test:e2e:db:reset
yarn test:e2e:run
```
Expected: All pass, zero failures.

- [ ] **Step 3: Fix any remaining failures**

Debug and fix. Most likely issues: cleanup order, missing factory fields, timing.

- [ ] **Step 4: Run lint**

```bash
yarn lint
```
Expected: No errors.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "test: final verification — all tests green, lint clean"
```

---

## Task 22: Update `test/app.e2e-spec.ts`

- [ ] **Step 1: Read the health controller**

Read `src/health/health.controller.ts` to see what the health endpoint returns.

- [ ] **Step 2: Update `test/app.e2e-spec.ts`**

Use `setupApp()`. Update to test the actual health endpoint (not `/ (GET)` which may not exist).

- [ ] **Step 3: Commit**

```bash
git add test/app.e2e-spec.ts
git commit -m "test: update app e2e test to match health endpoint"
```

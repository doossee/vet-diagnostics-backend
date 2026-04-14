# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
yarn start:dev          # Start with file watching
yarn build              # Compile TypeScript
yarn start:prod         # Run compiled build

# Database
yarn prisma:migrate     # Deploy migrations (uses prisma/schema/schema.prisma)
yarn prisma:seed        # Seed the database
npx prisma generate --schema prisma/schema/schema.prisma  # Regenerate client after schema changes

# Docker
yarn docker:up          # Build and start containers
yarn docker:down        # Stop containers

# Testing
yarn test               # Run all unit tests
yarn test:watch         # Watch mode
yarn test:cov           # Coverage report
yarn test:e2e           # E2E tests
yarn test -- path/to/file.spec.ts   # Single test file

# Code quality
yarn lint               # ESLint with auto-fix
yarn format             # Prettier
```

## Architecture

### Module Structure

Feature modules live in `src/modules/` (diagnostics, inventory, management, medical) and `src/auth/`. Each feature subdirectory follows this pattern:

```
animal-type/
├── animal-type.controller.ts
├── animal-type.service.ts
├── animal-type.module.ts
├── dto/                  # Request validation (class-validator)
├── entities/             # Response schemas (Swagger + class-transformer)
├── *.spec.ts             # Unit tests
└── *.controller.spec.ts  # Controller tests
```

`src/core/` contains `CoreModule` (the root module — not `AppModule`), Prisma service, and config. `src/shared/` contains global utilities (pagination, image service, filters, interceptors, base DTOs). Swagger UI is served at `/swagger`.

### Prisma

Schema is split across `prisma/schema/*.prisma` files — one per domain:
- `auth.prisma` — User, VetProfile, FarmerProfile
- `inventory.prisma` — Animal, AnimalType, Breed, Color
- `medical.prisma` — Disease, Prophylaxis
- `management.prisma` — Region, District, VetStation
- `clinical-exam.prisma`, `blood-exam.prisma`, `urine-exam.prisma`, `feces-exam.prisma`, `mucosa-exam.prisma`
- `session.prisma` — MedicalSession, DiagnosticSession, AIPrediction
- `anomaly.prisma` — AnomalyDetection rules

The Prisma client is generated to `src/generated/prisma/`. **Always import from `src/generated/prisma/client`**, not `@prisma/client`:
```typescript
import { PrismaClient } from 'src/generated/prisma/client';
import { Prisma } from 'src/generated/prisma/client';
```

`PrismaService` (`src/core/prisma/`) extends `PrismaClient` with the `PrismaPg` adapter (required for the connection pool).

### Bilingual Names

All lookup tables store bilingual content as JSONB: `name Json` with shape `{ ru: string, uz: string }`. The shared `NameDto` validates this structure. Search on these fields uses OR across both languages:
```typescript
OR: [
  { name: { path: ['ru'], string_contains: search } },
  { name: { path: ['uz'], string_contains: search } },
]
```

When writing JSONB name fields to Prisma, cast with: `data.name as unknown as Prisma.InputJsonValue`.

### DTOs & Validation

- **Create/Update DTOs:** `class-validator` decorators, `@ValidateNested()` + `@Type()` for nested objects
- **Query Params DTOs:** Extend `BaseQueryParamsDto` (includes `page`, `limit`, `search`)
- **Response Entities:** Use `@Expose()` from `class-transformer` for Swagger

Global `ValidationPipe` has `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`, `enableImplicitConversion: true`.

### Enums

Runtime enums are in `src/shared/enums.ts` and must stay in sync with Prisma schema enums. Import from there, not from the Prisma client.

### Authentication & Authorization

JWT-based auth with access + refresh tokens. Token rotation stored as `refreshTokenHash` on User.

- `@IsAuthenticated()` — applies `JwtAuthGuard`
- `@IsAdminUser()` — applies `JwtAuthGuard` + `RolesGuard([ADMIN])`
- `@GetCurrentUser()` — extracts typed user from `request.user`
- `@Public()` — marks endpoint as unauthenticated

Roles: `SUPER_ADMIN`, `ADMIN`, `VETERINARIAN`, `FARMER`.

### Pagination

`PaginationService.paginate()` returns `{ data: T[], meta: { total, lastPage, currentPage, perPage, prev, next } }`. All list endpoints use this pattern via `BaseQueryParamsDto`.

### Response Transformation

`ResponseTransformInterceptor` is applied globally. It converts Prisma `Decimal` → number, `Date` → ISO string, and prefixes image paths with the base URL.

`PrismaExceptionFilter` maps Prisma error codes (P2002, P2025, etc.) to HTTP exceptions.

### ML / AI Features

`featureValue Float` on reference table rows encodes categorical values for the ML model. `DiagnosticSession` links all five exam types to `AIPrediction`. `VetFeedback` supports retraining loop (`isCorrect`, `correctedDiseaseId`, `usedForTraining`). The prediction endpoint is configured via `PREDICT_API_URI` env var.

## Environment Variables

See `.env.example`. Key vars:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — min 32 chars
- `JWT_ACCESS_EXPIRE` / `JWT_REFRESH_EXPIRE` — e.g. `15m`, `7d`
- `PREDICT_API_URI` — External ML prediction service URL
- `UPLOAD_DEST` — File upload directory

## Testing

Tests use Jest with `ts-jest`. Unit tests mock `PrismaService`. Test database defaults to `postgresql://postgres:postgres@localhost:5432/vet_diagnostics_test` (configured in `test/jest-setup.ts`).

ESLint rules are relaxed in test files (unbound-method off, unsafe operations warn only).

## Branching

GitFlow: `main` (production), `develop` (integration), `feature/*`, `bugfix/*`, `hotfix/*`, `release/*`. See `GITFLOW.md` for details.

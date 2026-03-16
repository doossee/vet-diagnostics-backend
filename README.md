# Vet Diagnostics Backend

REST API backend for a veterinary health management platform serving Uzbekistan. Built with **NestJS 11**, **TypeScript**, **Prisma 7**, and **PostgreSQL**.

The system manages animal records, collects five types of clinical examinations, submits data to an external ML service for disease prediction, and runs real-time anomaly detection. All content is bilingual — Russian (`ru`) and Uzbek (`uz`).

---

## Documentation

| Document | Description |
|---|---|
| [Architecture](docs/ARCHITECTURE.md) | System design, tech stack, module layout |
| [API Reference](docs/API.md) | REST endpoints, request/response shapes |
| [Authentication](docs/AUTH.md) | JWT auth, roles, token rotation |
| [Data Model](docs/DATA_MODEL.md) | Prisma schema, entity relationships |
| [Modules](docs/MODULES.md) | Feature module breakdown |
| [ML / AI Integration](docs/ML_AI.md) | Prediction pipeline, feature vector, feedback loop |
| [Anomaly Detection](docs/ANOMALY_DETECTION_SYSTEM.md) | Real-time range-based anomaly alerts |

### Development

| Document | Description |
|---|---|
| [Setup](SETUP.md) | Local environment setup, secrets, branch protection |
| [Contributing](CONTRIBUTING.md) | Code style, PR workflow, review checklist |
| [Git Branching](GITFLOW.md) | GitFlow strategy — `main`, `develop`, `feature/*`, etc. |
| [Deployment](DEPLOYMENT.md) | Staging and production deployment guide |
| [CI/CD](.github/CI_CD.md) | GitHub Actions pipelines |
| [Branch Protection](.github/BRANCH_PROTECTION.md) | Protected branch rules |
| [Changelog](CHANGELOG.md) | Release history |

---

## Quick Start

```bash
# Install dependencies
yarn install

# Copy and fill in environment variables
cp .env.example .env

# Run database migrations and seed
yarn prisma:migrate
yarn prisma:seed

# Start in development mode (watch)
yarn start:dev
```

See [SETUP.md](SETUP.md) for full environment variable reference and Docker instructions.

---

## Commands

```bash
# Development
yarn start:dev          # Start with file watching
yarn build              # Compile TypeScript
yarn start:prod         # Run compiled build

# Database
yarn prisma:migrate     # Deploy migrations
yarn prisma:seed        # Seed the database

# Docker
yarn docker:up          # Build and start containers
yarn docker:down        # Stop containers

# Testing
yarn test               # Run all unit tests
yarn test:watch         # Watch mode
yarn test:cov           # Coverage report
yarn test:e2e           # End-to-end tests

# Code quality
yarn lint               # ESLint with auto-fix
yarn format             # Prettier
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | NestJS 11 |
| Language | TypeScript 5 |
| ORM | Prisma 7 (modular schema) |
| Database | PostgreSQL (PrismaPg connection pool) |
| Auth | Passport.js + JWT (access + refresh rotation) |
| Validation | class-validator + class-transformer |
| API Docs | Swagger / OpenAPI |
| Testing | Jest + ts-jest |

---

## License

Private — all rights reserved.

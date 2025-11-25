# Contributing to Vet Diagnostics Backend

Thank you for contributing! This document provides guidelines for contributing to this project.

## 🌳 GitFlow Workflow

We use GitFlow for branch management. Please read [`GITFLOW.md`](./GITFLOW.md) for detailed workflow instructions.

### Quick Start

1. **Fork and clone** the repository
2. **Create a branch** from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit:
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```
4. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`

**Examples:**

- `feat(auth): add password reset`
- `fix(api): resolve CORS issue`
- `test(user): add unit tests`

## 🧪 Testing

### Before Submitting PR

```bash
# Run all tests
npm run test

# Run linting
npm run lint

# Build application
npm run build
```

### Writing Tests

- Write unit tests for all new services
- Write controller tests for all new endpoints
- Update e2e tests for new workflows
- Maintain 80%+ code coverage

## 💻 Development Setup

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16

### Setup

```bash
# Install dependencies
yarn install

# Copy environment file
cp .env.example .env

# Start database
docker-compose up -d postgres

# Run migrations
npx prisma migrate dev

# Seed database
npm run prisma:seed

# Start development server
npm run start:dev
```

## 🎨 Code Style

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over types
- Use meaningful variable names
- Add JSDoc comments for complex logic

### NestJS

- Follow NestJS best practices
- Use dependency injection
- Keep controllers thin
- Business logic in services
- Use DTOs for validation

### File Organization

```
src/
  ├── auth/           # Authentication module
  ├── modules/        # Feature modules
  │   ├── management/
  │   ├── inventory/
  │   ├── medical/
  │   └── diagnostics/
  ├── core/           # Core functionality
  ├── shared/         # Shared utilities
  └── health/         # Health checks
```

## 🔍 Code Review

### PR Requirements

- [ ] All tests pass
- [ ] No linting errors
- [ ] Code coverage maintained
- [ ] Documentation updated
- [ ] Meaningful commit messages
- [ ] PR description filled out

### Review Process

1. Automated checks run on PR
2. Code review by maintainer(s)
3. Address feedback
4. Approval required before merge
5. Squash and merge to target branch

## 🐛 Reporting Bugs

### Before Reporting

- Check existing issues
- Verify it's reproducible
- Test on latest version

### Bug Report Should Include

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots/logs if applicable

## ✨ Suggesting Features

### Feature Request Should Include

- Clear use case
- Expected behavior
- Potential implementation approach
- Impact on existing features

## 📚 Documentation

### Update Documentation When

- Adding new features
- Changing APIs
- Modifying configuration
- Updating dependencies

### Documentation Files

- `README.md` - Project overview
- `DEPLOYMENT.md` - Deployment guide
- `GITFLOW.md` - Workflow guide
- API docs - Swagger/OpenAPI

## 🚫 What NOT to Do

- ❌ Commit directly to `main` or `develop`
- ❌ Commit `.env` files
- ❌ Commit `node_modules`
- ❌ Force push to shared branches
- ❌ Merge without PR review
- ❌ Skip tests
- ❌ Hardcode secrets

## ✅ Pull Request Checklist

Before submitting PR:

- [ ] Code follows project style
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass locally
- [ ] No new warnings
- [ ] Commit messages follow convention
- [ ] PR description is clear

## 🎯 Getting Help

- Check documentation first
- Search existing issues
- Ask in discussions
- Contact maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's license.

---

Thank you for contributing! 🙏

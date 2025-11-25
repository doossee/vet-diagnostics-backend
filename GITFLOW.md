# GitFlow Workflow Guide

## 📋 Overview

This project uses **GitFlow** branching strategy for organized development and releases.

## 🌳 Branch Structure

```
main (production)
  ├── develop (integration)
  │   ├── feature/* (new features)
  │   ├── bugfix/* (bug fixes)
  │   └── release/* (release prep)
  └── hotfix/* (urgent fixes)
```

## 📌 Branch Descriptions

### `main`

- **Purpose**: Production-ready code
- **Protected**: Yes
- **Auto-deploy**: Production environment
- **Merge from**: `release/*`, `hotfix/*`
- **Tagged**: All merges tagged with version

### `develop`

- **Purpose**: Integration branch for features
- **Protected**: Yes
- **Auto-deploy**: Staging environment
- **Merge from**: `feature/*`, `bugfix/*`, `release/*`

### `feature/*`

- **Purpose**: New features
- **Branch from**: `develop`
- **Merge to**: `develop`
- **Naming**: `feature/add-user-profile`, `feature/payment-integration`

### `bugfix/*`

- **Purpose**: Bug fixes
- **Branch from**: `develop`
- **Merge to**: `develop`
- **Naming**: `bugfix/fix-login-error`, `bugfix/cors-issue`

### `release/*`

- **Purpose**: Release preparation
- **Branch from**: `develop`
- **Merge to**: `main` AND `develop`
- **Naming**: `release/1.0.0`, `release/2.1.0`

### `hotfix/*`

- **Purpose**: Urgent production fixes
- **Branch from**: `main`
- **Merge to**: `main` AND `develop`
- **Naming**: `hotfix/critical-security-fix`, `hotfix/1.0.1`

---

## 🔄 Workflows

### Feature Development

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature

# 2. Develop and commit
git add .
git commit -m "feat: add new feature"

# 3. Push to remote
git push origin feature/my-new-feature

# 4. Create Pull Request to develop
# - PR checks will run automatically
# - Request code review
# - Address feedback

# 5. Merge to develop (after approval)
# - Staging deployment triggers automatically
```

### Bug Fix

```bash
# 1. Create bugfix branch from develop
git checkout develop
git pull origin develop
git checkout -b bugfix/fix-issue-123

# 2. Fix and commit
git add .
git commit -m "fix: resolve issue #123"

# 3. Push and create PR to develop
git push origin bugfix/fix-issue-123
```

### Release Preparation

```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/1.0.0

# 2. Update version in package.json
npm version 1.0.0 --no-git-tag-version

# 3. Update CHANGELOG.md
# Document all changes

# 4. Commit and push
git add .
git commit -m "chore: prepare release 1.0.0"
git push origin release/1.0.0

# 5. Create PR to main
# - All checks run
# - Deploy to staging for final testing

# 6. After approval, merge to main
# - Production deployment triggers
# - GitHub release created automatically

# 7. Merge back to develop
git checkout develop
git merge release/1.0.0
git push origin develop
```

### Hotfix (Urgent Production Fix)

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# 2. Fix and bump patch version
npm version patch --no-git-tag-version

# 3. Commit and push
git add .
git commit -m "fix: critical security issue"
git push origin hotfix/critical-fix

# 4. Create PR to main
# - Fast-track review
# - Deploy to production

# 5. Merge to develop as well
git checkout develop
git merge hotfix/critical-fix
git push origin develop
```

---

## 🔒 Branch Protection Rules

### `main` Branch

- ✅ Require pull request reviews (2 approvals)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require linear history
- ✅ Do not allow force pushes
- ✅ Do not allow deletions

### `develop` Branch

- ✅ Require pull request reviews (1 approval)
- ✅ Require status checks to pass
- ✅ Do not allow force pushes
- ✅ Do not allow deletions

---

## 📝 Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `chore`: Build/tooling changes
- `ci`: CI/CD changes

### Examples

```bash
feat(auth): add password reset functionality
fix(api): resolve CORS issue on login endpoint
docs(readme): update deployment instructions
test(user): add unit tests for user service
ci(github): add automated deployment workflow
```

---

## 🚀 CI/CD Pipeline

### Pull Request

- ✅ Lint code
- ✅ Run tests
- ✅ Build application
- ✅ Security scan
- ✅ Coverage report

### Develop Branch (Staging)

- ✅ All PR checks
- ✅ Build Docker image
- ✅ Deploy to staging
- ✅ Smoke tests

### Main Branch (Production)

- ✅ All checks
- ✅ Build production image
- ✅ Deploy to production
- ✅ Create GitHub release
- ✅ Tag version

---

## 🎯 Quick Reference

| Action              | Command                                 |
| ------------------- | --------------------------------------- |
| Start feature       | `git checkout -b feature/name develop`  |
| Start bugfix        | `git checkout -b bugfix/name develop`   |
| Start release       | `git checkout -b release/X.Y.Z develop` |
| Start hotfix        | `git checkout -b hotfix/X.Y.Z main`     |
| Update from develop | `git pull origin develop`               |
| Create PR           | Push branch and use GitHub UI           |

---

## 📚 Resources

- [GitFlow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

## ⚠️ Important Rules

1. **Never commit directly to `main` or `develop`**
2. **Always create PRs for code review**
3. **Keep feature branches small and focused**
4. **Write meaningful commit messages**
5. **Update tests with code changes**
6. **Delete branches after merging**
7. **Keep develop and main in sync**

---

## 🆘 Common Issues

### Merge Conflicts

```bash
# Update your branch with latest develop
git checkout develop
git pull origin develop
git checkout feature/your-feature
git merge develop
# Resolve conflicts
git commit
```

### Forgot to Branch from Develop

```bash
# If you committed to wrong branch
git stash
git checkout develop
git checkout -b feature/correct-branch
git stash pop
```

### Need to Update PR

```bash
# Just push more commits to the same branch
git add .
git commit -m "fix: address review feedback"
git push origin feature/your-feature
# PR updates automatically
```

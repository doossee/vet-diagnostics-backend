# Branch Protection Rules Setup Guide

Follow these steps to configure branch protection in GitHub.

## 🔒 Main Branch Protection

**Settings → Branches → Add rule**

### Branch name pattern

```
main
```

### Settings to enable:

#### Protect matching branches

- [x] Require a pull request before merging
  - [x] Require approvals: **2**
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require review from Code Owners

#### Status checks

- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - Required checks:
    - `Lint Code`
    - `Run Tests`
    - `Build Application`
    - `Security Scan`

#### Additional settings

- [x] Require conversation resolution before merging
- [x] Require linear history
- [x] Do not allow bypassing the above settings
- [x] Restrict who can push to matching branches
  - Add: Repository admins only

#### Rules applied to everyone

- [x] Block force pushes
- [x] Block deletions

---

## 🔒 Develop Branch Protection

**Settings → Branches → Add rule**

### Branch name pattern

```
develop
```

### Settings to enable:

#### Protect matching branches

- [x] Require a pull request before merging
  - [x] Require approvals: **1**
  - [x] Dismiss stale pull request approvals when new commits are pushed

#### Status checks

- [x] Require status checks to pass before merging
  - Required checks:
    - `Lint Code`
    - `Run Tests`
    - `Build Application`

#### Additional settings

- [x] Require conversation resolution before merging

#### Rules applied to everyone

- [x] Block force pushes
- [x] Block deletions

---

## 🔒 Release Branch Protection

**Settings → Branches → Add rule**

### Branch name pattern

```
release/**
```

### Settings to enable:

#### Protect matching branches

- [x] Require a pull request before merging
  - [x] Require approvals: **1**

#### Status checks

- [x] Require status checks to pass before merging
  - Required checks:
    - `Validate Release`
    - `Build Release Candidate`

---

## ✅ Verification

After setting up, verify:

1. Try to push directly to `main` → Should be blocked
2. Try to push directly to `develop` → Should be blocked
3. Create PR without passing checks → Should be blocked from merging
4. Create PR with passing checks → Should be mergeable after approval

---

## 📝 Quick Setup Checklist

- [ ] Main branch protection configured
- [ ] Develop branch protection configured
- [ ] Release branch protection configured
- [ ] Required status checks added
- [ ] Code owners configured
- [ ] Approval requirements set
- [ ] Force push blocked
- [ ] Branch deletion blocked
- [ ] Linear history required (main only)

---

## 🔗 GitHub Settings Path

```
Repository → Settings → Branches → Add branch protection rule
```

---

## 💡 Tips

- **Start strict**: It's easier to relax rules than to tighten them later
- **Test rules**: Create test PRs to verify protection works
- **Document exceptions**: If you need to bypass, document why
- **Review regularly**: Update rules as team grows

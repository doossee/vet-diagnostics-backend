#!/bin/bash

# Version Bump Script
# Usage: ./scripts/version-bump.sh [major|minor|patch]

set -e

VERSION_TYPE=${1:-patch}

echo "🔢 Bumping version: $VERSION_TYPE"

# Bump version in package.json
npm version $VERSION_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")

echo "✅ Version bumped to: $NEW_VERSION"

# Update CHANGELOG.md
DATE=$(date +%Y-%m-%d)
echo -e "\n## [$NEW_VERSION] - $DATE\n" >> CHANGELOG.md

# Commit changes
git add package.json CHANGELOG.md
git commit -m "chore: bump version to $NEW_VERSION"

echo "📝 Committed version bump"
echo "🎯 New version: $NEW_VERSION"
echo ""
echo "Next steps:"
echo "1. Push changes: git push origin \$(git branch --show-current)"
echo "2. Create PR to main for release"

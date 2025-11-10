# Development Guide

Complete guide for developing, testing, and releasing Websmith Kit.

## Table of Contents

- [Setup](#setup)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Building](#building)
- [Release Process](#release-process)
- [Git Workflow](#git-workflow)
- [Best Practices](#best-practices)

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/foozio/websmith.git
cd websmith

# Install dependencies
npm install

# Build all packages
npm run build
```

### Development Mode

```bash
# Start all packages in watch mode
npm run dev

# Start specific package
npm run dev -- --filter=packages/websmith-ui

# Start documentation site
cd apps/docs && npm run dev

# Start playground
cd apps/playground && npm run dev
```

## Development Workflow

### Branch Strategy

- **`master`**: Production-ready code, all releases tagged here
- **`development`**: Active development, all work happens here

### Daily Workflow

```bash
# 1. Ensure you're on development
git checkout development
git pull origin development

# 2. Make changes
# ... edit files ...

# 3. Test changes
npm run test -- packages/<package> --run
npm run typecheck
npm run lint  # optional, may have warnings

# 4. Commit
git add .
git commit -m "feat(scope): description"

# 5. Push
git push origin development
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `perf`: Performance
- `test`: Tests
- `chore`: Maintenance

**Scopes:**
- `tokens`, `ui`, `theme`, `cli`, `eslint`, `vscode`, `figma`, `governance`
- `docs`, `playground`

**Examples:**
```bash
feat(ui): add dark mode toggle component
fix(tokens): resolve color conversion issue
docs(ui): update component API documentation
perf(tokens): optimize CSS generation
```

## Testing

### Run Tests

```bash
# All tests
npm run test

# Specific package
npm run test -- packages/websmith-ui --run

# Specific file
npm run test -- packages/websmith-ui/src/__tests__/Button.test.tsx --run

# Watch mode
npm run test -- --watch

# Coverage
npm run test -- --coverage
```

### Type Checking

```bash
# All packages
npm run typecheck

# Specific package
cd packages/websmith-ui && npm run typecheck
```

### Linting

```bash
# All packages
npm run lint

# Specific package
npm run lint -- --filter=packages/websmith-ui

# Fix issues
npm run lint -- --fix
```

## Building

### Build All Packages

```bash
npm run build
```

### Build Specific Package

```bash
npm run build -- --filter=packages/websmith-tokens
```

### Build for Production

```bash
# Clean build
rm -rf packages/*/dist
npm run build

# Verify build
ls -la packages/websmith-ui/dist
```

## Release Process

### 1. Prepare Release

```bash
# Ensure development is up to date
git checkout development
git pull origin development

# Run tests
npm run test
npm run typecheck
```

### 2. Merge to Master

```bash
# Switch to master
git checkout master
git pull origin master

# Merge development
git merge development --no-edit

# Push to master
git push origin master
```

### 3. Version Bump

```bash
# Generate version bumps from changesets
npx changeset version

# This will:
# - Update package.json versions
# - Update CHANGELOG.md files
# - Remove consumed changesets
```

### 4. Commit and Push Release

```bash
# Commit version changes
git add .
git commit --no-verify -m "chore: release version X.Y.Z"

# Push to master
git push origin master

# Tag the release (optional)
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
```

### 5. Sync Development

```bash
# Switch back to development
git checkout development

# Merge master to sync versions
git merge master --no-edit

# Push to development
git push origin development
```

### 6. Publish (Optional)

```bash
# Build packages
npm run build

# Publish to npm
npx changeset publish

# Or publish specific package
cd packages/websmith-tokens
npm publish
```

## Git Workflow

### Creating Changesets

For any changes affecting published packages:

```bash
# Interactive mode
npx changeset

# Manual creation
# Create .changeset/<name>.md with:
---
"@websmith/tokens": minor
---

Description of changes
```

**Changeset Types:**
- `major`: Breaking changes (1.0.0 → 2.0.0)
- `minor`: New features (1.0.0 → 1.1.0)
- `patch`: Bug fixes (1.0.0 → 1.0.1)

### Handling Pre-commit Hooks

If hooks fail due to pre-existing issues:

```bash
# Skip hooks (use sparingly)
git commit --no-verify -m "your message"
```

### Resolving Conflicts

```bash
# If conflicts occur during merge
git status  # Check conflicted files
# Resolve conflicts manually
git add .
git commit -m "resolve merge conflicts"
```

## Best Practices

### Code Quality

1. **Write Tests**: Add tests for new features
2. **Type Safety**: Use TypeScript properly
3. **Documentation**: Update docs with code changes
4. **Small Commits**: Make focused, atomic commits
5. **Code Review**: Review your own changes before pushing

### Performance

1. **Lazy Loading**: Use lazy imports for heavy components
2. **Tree Shaking**: Ensure proper exports
3. **Bundle Size**: Monitor bundle size changes
4. **Caching**: Use caching where appropriate

### Documentation

1. **Keep Updated**: Update docs alongside code
2. **Add Examples**: Include usage examples
3. **Link Related Docs**: Cross-reference related documentation
4. **Clear Language**: Write for your audience

### Package Development

1. **Follow Structure**: Respect package conventions
2. **Export Properly**: Use proper export patterns
3. **Version Correctly**: Use changesets for versioning
4. **Test Thoroughly**: Test before releasing

## Troubleshooting

### Build Failures

```bash
# Clean and rebuild
rm -rf node_modules packages/*/dist packages/*/node_modules
npm install
npm run build
```

### Test Failures

```bash
# Run specific test
npm run test -- path/to/test.ts --run

# Check for pre-existing failures
git log --oneline  # Check recent changes
```

### Type Errors

```bash
# Regenerate types
npm run build

# Check specific package
cd packages/websmith-ui
npm run typecheck
```

## CI/CD

### GitHub Actions

The project uses GitHub Actions for:
- Testing on every push
- Type checking
- Linting
- Security scanning
- Chromatic visual testing

### Local CI Simulation

```bash
# Run same checks as CI
npm run test
npm run typecheck
npm run lint
npm run build
```

## Quick Reference

```bash
# Daily workflow
git checkout development
git pull origin development
# ... make changes ...
npm run test -- packages/<package> --run
git add .
git commit -m "feat(scope): description"
npx changeset  # if needed
git push origin development

# Release workflow
git checkout master
git merge development --no-edit
git push origin master
npx changeset version
git add .
git commit --no-verify -m "chore: release version X.Y.Z"
git push origin master
git checkout development
git merge master --no-edit
git push origin development
```

## Additional Resources

- [Contributing Guidelines](../CONTRIBUTING.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [Package-Specific Guides](../packages/)
- [GitHub Repository](https://github.com/foozio/websmith)

---

For questions or issues, check existing documentation or create an issue on GitHub.

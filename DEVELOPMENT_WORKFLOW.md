# Development Workflow

This document describes the development workflow for the Websmith Kit project.

## Branch Strategy

### Main Branches

- **`master`**: Production-ready code. All releases are tagged from this branch.
- **`development`**: Active development branch. All feature work happens here.

### Workflow

1. **Development**: All work is done on the `development` branch
2. **Testing**: Run tests and ensure quality before merging
3. **Merge to Master**: When ready for release, merge `development` to `master`
4. **Version Bump**: Use Changesets to bump versions
5. **Release**: Commit version changes and push to `master`
6. **Sync**: Merge `master` back to `development` to keep in sync

## Development Process

### 1. Start Development

```bash
# Ensure you're on development branch
git checkout development
git pull origin development

# Create your changes
# ... make changes ...
```

### 2. Test Your Changes

```bash
# Run tests for specific package
npm run test -- packages/websmith-tokens --run

# Run all tests
npm run test

# Type check
npm run typecheck

# Lint (optional, may have pre-existing warnings)
npm run lint
```

### 3. Commit Changes

```bash
# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat(tokens): add new feature"

# If pre-commit hooks fail due to pre-existing issues, use:
git commit --no-verify -m "feat(tokens): add new feature"
```

### 4. Create Changeset

For any changes that affect published packages:

```bash
# Create changeset interactively
npx changeset

# Or create manually in .changeset/ directory
```

### 5. Push to Development

```bash
git push origin development
```

## Release Process

### 1. Prepare for Release

```bash
# Ensure development is up to date
git checkout development
git pull origin development

# Run final tests
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

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes

### Scopes

- **tokens**: websmith-tokens package
- **ui**: websmith-ui package
- **theme**: websmith-theme package
- **cli**: websmith-cli package
- **eslint**: websmith-eslint package
- **vscode**: websmith-vscode package
- **docs**: Documentation site
- **playground**: Playground app

### Examples

```bash
feat(tokens): add caching for token generation
fix(ui): resolve button hover state issue
docs(tokens): update API documentation
perf(tokens): optimize CSS variable generation
test(ui): add tests for Dialog component
chore: update dependencies
```

## Changeset Guidelines

### Creating Changesets

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

### Changeset Types

- **major**: Breaking changes (1.0.0 → 2.0.0)
- **minor**: New features (1.0.0 → 1.1.0)
- **patch**: Bug fixes (1.0.0 → 1.0.1)

### Example Changeset

```markdown
---
"@websmith/tokens": minor
"@websmith/ui": patch
---

Add caching strategies for token generation

- Implement LRU cache with TTL
- Add performance monitoring integration
- Fix button component styling issue
```

## Testing Guidelines

### Before Committing

1. Run tests for affected packages
2. Ensure new code has test coverage
3. Run type checking
4. Verify build succeeds

### Test Commands

```bash
# Run all tests
npm run test

# Run specific package tests
npm run test -- packages/websmith-tokens --run

# Run specific test file
npm run test -- packages/websmith-tokens/src/__tests__/cache.test.ts --run

# Watch mode
npm run test -- --watch

# Coverage
npm run test -- --coverage
```

## Documentation Updates

Always update relevant documentation when making changes:

### Package Documentation

- **AGENTS.md**: Package-specific development guidelines
- **README.md**: Package overview and usage
- **CHANGELOG.md**: Automatically updated by Changesets

### Project Documentation

- **TASKS.md**: Project tasks and progress
- **PRD.md**: Product requirements
- **ERD.md**: Entity relationship diagrams
- **AGENTS.md**: Repository-level guidelines

### Feature Documentation

Create dedicated documentation files for major features:

- **CACHING.md**: Caching implementation details
- **CSS-OPTIMIZATION.md**: CSS generation optimization
- **PERFORMANCE_MONITORING.md**: Performance tracking

## Troubleshooting

### Pre-commit Hook Failures

If pre-commit hooks fail due to pre-existing issues:

```bash
# Skip hooks (use sparingly)
git commit --no-verify -m "your message"
```

### Test Failures

If tests fail due to pre-existing issues unrelated to your changes:

1. Document the failures
2. Run only your new tests to verify they pass
3. Create an issue to track pre-existing failures
4. Use `--no-verify` if necessary

### Merge Conflicts

```bash
# If conflicts occur during merge
git status  # Check conflicted files
# Resolve conflicts manually
git add .
git commit -m "resolve merge conflicts"
```

## Best Practices

1. **Small Commits**: Make focused, atomic commits
2. **Clear Messages**: Write descriptive commit messages
3. **Test First**: Ensure tests pass before committing
4. **Document Changes**: Update docs alongside code changes
5. **Review Changesets**: Verify changeset content before releasing
6. **Sync Regularly**: Keep development branch up to date
7. **Clean History**: Use meaningful commit messages for easy tracking

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

## CI/CD

The project uses GitHub Actions for:

- **Testing**: Run on every push
- **Type Checking**: Verify TypeScript types
- **Linting**: Check code style
- **Security Scanning**: Detect vulnerabilities
- **Chromatic**: Visual regression testing

## Publishing

Packages are published to npm:

```bash
# After version bump and release
npm run build
npx changeset publish

# Or publish specific package
cd packages/websmith-tokens
npm publish
```

## Support

For questions or issues:

1. Check existing documentation
2. Review AGENTS.md files
3. Check TASKS.md for known issues
4. Create an issue on GitHub

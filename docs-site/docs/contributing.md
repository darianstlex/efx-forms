# Contributing to EFX-Forms

Thank you for considering contributing to EFX-Forms! This guide will help you get started with development.

## Development Setup

### Prerequisites

- Node.js (version matching project requirements)
- npm
- Git

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/darianstlex/efx-forms.git
cd efx-forms

# Install dependencies
npm install
```

### Build

Build the library (CJS + ESM):

```bash
npm run build
```

This command:
1. Cleans the `lib/` directory
2. Compiles TypeScript
3. Runs `npmize` to create the ESM build in `lib/mjs/`

## Running Tests

EFX-Forms uses Playwright Component Testing (CT) for testing.

### Run All Tests

```bash
npm test
```

Runs tests in headless mode across configured browsers (Chromium + Firefox).

### Run Tests in UI Mode

```bash
npm run test:open
```

Opens the Playwright UI for interactive test development and debugging.

### Test Conventions

- Test files use `.spec.tsx` or `.spec.ts` extension
- Tests are located in `src/tests/`
- Use `data-test` attributes for selectors (not `data-testid`)
- No mocking - tests use real components via `mount()`

## Code Style

### Linting

```bash
npm run lint
```

Runs ESLint on TypeScript and TSX files.

### TypeScript

- `noImplicitAny: false` - implicit any is allowed
- Tests are excluded from TypeScript build
- Flat `src/` structure (no subdirectories)

### Conventions

**Naming:**
- Components: `*Component.tsx` (FormComponent, FieldComponent)
- Hooks: `use*.ts` (useForm, useField, useFieldData)

**Imports:**
- Sub-path imports work without `exports` field:
  - `efx-forms/validators` → `src/validators.ts`
  - `efx-forms/FormDataProvider` → `src/FormDataProvider.tsx`
  - `efx-forms/utils` → `src/utils.ts`

## Pull Request Process

### 1. Fork and Branch

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/efx-forms.git
cd efx-forms

# Create a feature branch
git checkout -b feature/your-feature-name
```

### 2. Develop

- Make your changes
- Follow existing code style
- Add tests for new functionality
- Update documentation if needed

### 3. Verify

Before committing, ensure:

```bash
# Build passes
npm run build

# All tests pass
npm test

# Linting passes
npm run lint
```

### 4. Commit

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add new validator for phone numbers"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Go to GitHub and create a Pull Request from your branch to `main`.

### PR Requirements

- Clear description of changes
- Link to related issues (if any)
- All tests passing
- Build passing
- Linting passing

### Review Process

- Maintainers will review your PR
- Address feedback by pushing additional commits
- Once approved, your PR will be merged

## Release Process

### Versioning

EFX-Forms follows semantic versioning:
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes

### Publishing

**Stable Release:**

```bash
npm run publish-lib
```

Builds and publishes to npm with the latest tag.

**Beta Release:**

```bash
npm run publish-beta
```

Publishes with the `beta` tag for pre-releases.

**Dry Run:**

```bash
npm run publish-dryrun
```

Test the publish process without actually publishing.

### Release Steps

1. Update version in `package.json`
2. Run build: `npm run build`
3. Test thoroughly: `npm test`
4. Publish: `npm run publish-lib` or `npm run publish-beta`

## Bug Reports

Found a bug? Please report it on GitHub Issues:

- [EFX-Forms Issues](https://github.com/darianstlex/efx-forms/issues)

When reporting:
- Describe the issue clearly
- Include steps to reproduce
- Provide expected vs actual behavior
- Include code examples if applicable

## Questions?

- Review the [Examples](/docs/examples) documentation
- Check out the [Quick Links](/docs/examples#quick-links) for common patterns
- Open an issue for questions

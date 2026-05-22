# SRC/TESTS/ KNOWLEDGE BASE

**Scope:** Component testing with Playwright CT
**Parent:** ../AGENTS.md

## OVERVIEW

Playwright Component Testing (NOT Jest/Vitest). Tests in src/tests/, excluded from TypeScript build. Real components, no mocking.

## STRUCTURE

```
src/tests/
├── selectors.ts           # Centralized data-test selectors
├── validators.spec.ts     # Unit tests for validators
├── components/            # Test fixtures
│   ├── Hooks/             # useForm, useField test harnesses
│   ├── Input/             # Input field test components
│   ├── Checkbox/          # Checkbox test components
│   └── Button/            # Button test components
└── *.spec.tsx             # Integration tests: Validation, Update, DirtyTouchErrors
```

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Selector pattern | selectors.ts | `sel` object with data-test attributes |
| State capture | components/Hooks/index.tsx | OnSendParams type, SendFormData helper |
| Component tests | *.spec.tsx | mount(), locator(), expect() patterns |
| Validator tests | validators.spec.ts | Pure function tests with Playwright runner |
| Test config | ../../playwright-ct.config.ts | Chromium + Firefox, 10s timeout |

## CONVENTIONS

**Test files:**
- Naming: `*.spec.tsx` or `*.spec.ts` (NOT *.test.*)
- Location: src/tests/ (inside src, excluded via tsconfig)
- Pattern: `test.describe()`, `test()` from Playwright

**Selectors:**
- Use `data-test` attributes (NOT data-testid)
- Centralized: `import { sel } from './selectors'`
- Format: `'[data-test="field-name-error"]'`

**State Capture:**
- `OnSendParams` type captures form snapshots
- `SendFormData` component with "Set Data" button
- Pattern: `await sendData.click()` → `expect(data.form.values).toEqual(...)`

**Re-render:**
- `component.update(<Component ... />)` for prop changes
- Tests: initial render → update() → verify transitions

**Mount:**
- `await mount(<Component />)` - real components
- No mocking infrastructure
- State isolation via OnSendParams

## ANTI-PATTERNS (THIS DIRECTORY)

**TypeScript:**
- ❌ Test files use `any` freely (intentional for test flexibility)
- ❌ No explicit return types on test helpers

**Structure:**
- ❌ Tests inside src/ (unusual - typically __tests__/ or tests/ at root)
- ❌ Nested component fixtures in components/ subdirectories

## UNIQUE STYLES

**Multi-browser:**
- Tests run on Chromium + Firefox
- CI: 2 retries, 1 worker
- Local: fullyParallel: true

**No setup files:**
- No setupTests.ts, no global mocks
- Each test self-contained
- No beforeEach pollution

**Visual regression:**
- snapshotDir: ./__snapshots__
- toMatchScreenshot available but not heavily used

## NOTES

**Playwright CT config:**
- ctPort: 3100 (custom dev server)
- timeout: 10s (short for component tests)
- outputDir: playwright/test-results/
- reporter: html → playwright/report/

**Excluded from build:**
- tsconfig.json: `exclude: ["src/tests/**/*"]`
- Tests not compiled to lib/

# EFX-FORMS KNOWLEDGE BASE

**Generated:** 2025-05-18
**Commit:** HEAD
**Branch:** main

## OVERVIEW

Effector-based React form library. TypeScript, flat src/ structure, Playwright CT testing. Single ESM build with .js extensions.

## STRUCTURE

```
efx-forms/
├── src/              # All source code (flat, no subdirs)
├── src/tests/        # Component tests (Playwright CT)
├── playwright/       # Test infrastructure
├── lib/              # Build output (gitignored)
└── package.json      # Main: index.js, Types: index.d.ts
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Core form logic | src/form.ts | 12.5K lines, main state machine |
| Components | src/*Component.tsx | FormComponent, FieldComponent, etc. |
| Hooks | src/use*.ts | 12 hooks: useForm, useField, etc. |
| Types | src/types.ts | 9.7K lines, all TS interfaces |
| Validators | src/validators.ts | Built-in validators (required, email, etc.) |
| Utils | src/utils.ts | truthyFy, shapeFy, flattenObjectKeys |
| Tests | src/tests/*.spec.tsx | Playwright CT, .spec.tsx naming |
| Test infra | playwright/ | CT config, fixtures |

## CODE MAP

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| Form | Component | src/ | Main form wrapper, context provider |
| Field | Component | src/ | Field wrapper, validation, state sync |
| getForm | Function | src/forms.ts | Registry: get form instance by name |
| useFormInstance | Hook | src/ | Get form from context |
| $values | Store | src/form.ts | Form values store |
| $errors | Store | src/form.ts | Form errors store |
| submit | Effect | src/form.ts | Form submit effect |
| OnSendParams | Type | src/tests/components/Hooks/ | Test state capture |

## CONVENTIONS

**Naming:**
- Components: `*Component.tsx` (FormComponent, FieldComponent)
- Hooks: `use*.ts` (useForm, useField, useFieldData)
- Tests: `*.spec.tsx` or `*.spec.ts`

**Selectors:**
- Use `data-test` attributes (NOT data-testid)
- Centralized in `src/tests/selectors.ts` as `sel` object

**State Capture (tests):**
- `OnSendParams` type captures form snapshots
- `SendFormData` helper component with "Set Data" button
- Pattern: `await sendData.click()` then verify `data.form.values`

**Re-render (tests):**
- `component.update(<Component ... />)` for prop changes

## ANTI-PATTERNS (THIS PROJECT)

**TypeScript:**
- ❌ `Record<string, any>` - pervasive throughout codebase
- ❌ `Store<any>` - constants.ts, useStoreProp hooks
- ❌ `ComponentType<any>` - FieldComponent props
- ❌ Index signatures: `[any: string]: any` in types.ts
- ✅ ESLint: `@typescript-eslint/no-explicit-any` is OFF

**Build:**
- ❌ Custom `npmize` bash script (not standard npm pack)
- ❌ No GitHub Actions (uses .sisyphus/ custom CI)

**Structure:**
- ❌ Flat src/ - no components/, hooks/, utils/ directories
- ❌ Tests in src/tests/ (excluded via tsconfig)

## UNIQUE STYLES

**Sub-path imports:**
- `efx-forms/validators` → src/validators.ts
- `efx-forms/FormDataProvider` → src/FormDataProvider.tsx
- `efx-forms/utils` → src/utils.ts
- No `exports` field in package.json - works via direct file paths

**Build output:**
- `lib/` - ESM syntax (TypeScript `module: "esnext"`)
- No `.js` extensions on relative imports - modern bundlers auto-resolve
- No `"type": "module"` flag needed (works with Vite, Webpack 5, Rollup)

**Test patterns:**
- Playwright CT (not Jest/Vitest)
- No mocking - real components via `mount()`
- Multi-browser: Chromium + Firefox

## COMMANDS

```bash
# Build (ESM)
npm run build        # rm -rf lib/* && tsc && ./npmize (copies to lib/, removes devDeps)

# Publish
npm run publish-lib  # Publish to npm
npm run publish-beta # Publish with --tag beta
npm run publish-dryrun # Dry run

# Test
npm test             # Playwright CT
npm run test:open    # Playwright UI mode

# Lint
npm run lint         # ESLint
```

## NOTES

**Gotchas:**
- `lib/` is gitignored - build before publish
- `noImplicitAny: false` - allows implicit any
- Tests excluded from TypeScript build
- Beta releases: `npm run publish-beta`
- No `.js` extensions on imports - bundlers auto-resolve (Vite, Webpack 5, Rollup)

**Peer Dependencies:**
- effector: >=23.0.0 <24.0.0
- effector-react: >=23.0.0 <24.0.0
- lodash: ^4.17.0
- react: >=16.8.0 <20.0.0

# PLAYWRIGHT/ KNOWLEDGE BASE

**Scope:** Test infrastructure configuration
**Parent:** ../AGENTS.md

## OVERVIEW

Playwright Component Testing configuration. Minimal setup - index.tsx hook + config file. No E2E tests, component testing only.

## STRUCTURE

```
playwright/
├── index.tsx            # BeforeMount hook: global styles, providers
└── (test-results/)      # Generated output (gitignored)
└── (report/)            # HTML report (gitignored)
```

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Test setup | index.tsx | BeforeMount: wraps components with providers |
| Configuration | ../playwright-ct.config.ts | Browser projects, timeout, workers |

## CONVENTIONS

**BeforeMount hook:**
- `playwright/index.tsx` - runs before each component mount
- Use for: global styles, context providers, theme setup
- Currently minimal (check file for current implementation)

**Config location:**
- `playwright-ct.config.ts` at project root (NOT in playwright/)
- Defines: projects, timeout, retries, workers, reporter

## UNIQUE STYLES

**Component Testing (NOT E2E):**
- `@playwright/experimental-ct-react`
- Mounts React components in isolation
- No browser navigation, no routing tests

**Output structure:**
- test-results/ - screenshots, traces (CI retries)
- report/ - HTML test report
- Both gitignored, generated on test run

## NOTES

**Config is at root:**
- Main config: `./playwright-ct.config.ts`
- playwright/ directory only contains index.tsx hook
- Confusing: directory name suggests E2E, but it's CT

**CI behavior:**
- workers: 1 (sequential on CI)
- retries: 2 (flaky test recovery)
- forbidOnly: true (fail on test.only in CI)

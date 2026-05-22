# SRC/ KNOWLEDGE BASE

**Scope:** Core library source code
**Parent:** ./AGENTS.md

## OVERVIEW

Flat structure TypeScript/React source. 28 files, no subdirectories (except tests/). Effector state machine + React components.

## STRUCTURE

```
src/
├── form.ts              # Core: 12.5K lines, state machine
├── types.ts             # Types: 9.7K lines, all interfaces
├── index.ts             # Exports: Form, Field, getForm, useFormInstance
├── *Component.tsx       # 6 components: Form, Field, Providers, Conditionals
├── use*.ts              # 12 hooks: useForm, useField, useStoreProp, etc.
├── forms.ts             # Registry: getForm by name
├── context.tsx          # React context provider
├── validators.ts        # Built-in validators: required, email, etc.
├── utils.ts             # truthyFy, shapeFy, flattenObjectKeys
└── constants.ts         # $null store, field defaults
```

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Form state machine | form.ts | $values, $errors, submit effect, validation logic |
| Type definitions | types.ts | IForm, IField, FormInstance, all TS interfaces |
| Component exports | index.ts | Only 5 exports - rest via sub-path imports |
| Field logic | FieldComponent.tsx | Field wrapper, validation, onChange/onBlur |
| Hook implementations | use*.ts | useForm, useField, useFormData, useStoreProp variants |
| Validator functions | validators.ts | required(), email(), min(), max(), etc. |

## CONVENTIONS

**File naming:**
- Components: `*Component.tsx` (FormComponent, FieldComponent, FormDataProvider)
- Hooks: `use*.ts` (useForm.ts, useField.ts, useFieldData.ts)
- No barrel exports except index.ts (5 exports only)

**TypeScript:**
- `noImplicitAny: false` - implicit any allowed
- `Record<string, any>` pervasive - intentional for form flexibility
- Strict mode enabled except `noImplicitAny`

**Imports:**
- Sub-path imports work without `exports` field: `efx-forms/validators`
- Direct file paths in package (no npm magic)

## ANTI-PATTERNS (THIS DIRECTORY)

**Type Safety:**
- ❌ `Record<string, any>` - form.ts, types.ts, utils.ts (30+ occurrences)
- ❌ `Store<any>` - constants.ts ($null), useStoreProp hooks
- ❌ `ComponentType<any>` - FieldComponent props
- ❌ Index signatures: `[any: string]: any` in types.ts

**Architecture:**
- ❌ form.ts is 12.5K lines - monolithic state machine
- ❌ Flat structure - no grouping by type (components/, hooks/, utils/)
- ❌ Mixed .ts/.tsx at root level

## NOTES

**form.ts complexity:**
- Single file contains: domain creation, store definitions, effects, events, validation logic
- Exports: createForm function, FormInstance interface
- Do not refactor without understanding effector patterns

**Sub-path imports:**
- Work because TypeScript resolves direct file paths
- No `exports` field in package.json needed
- Build copies files to lib/ maintaining structure

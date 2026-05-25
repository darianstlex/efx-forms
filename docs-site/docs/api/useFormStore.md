# useFormStore

Get a single form store value by name. Returns the current value of the specified effector store.

## Import

```ts
import { useFormStore } from 'efx-forms/useFormStore';
```

## Signature

```ts
function useFormStore<T extends TFormStoreKey>(
  store: T,
  formName?: string
): UnitValue<IForm[T]>
```

Available store names:
- `'$values'` - Form values
- `'$errors'` - Form errors
- `'$active'` - Active fields
- `'$dirties'` - Dirty fields
- `'$touches'` - Touched fields
- `'$valid'` - Form validity
- `'$touched'` - Form touched state
- `'$dirty'` - Form dirty state
- `'$submitting'` - Form submitting state

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `store` | `TFormStoreKey` | Yes | Name of the store to subscribe to |
| `formName` | `string` | No | Form name. Auto-detected from context if not provided |

## Return Type

The value type depends on the store:
- `'$values'` → `IRValues`
- `'$errors'` → `IRErrors`
- `'$active'`, `'$dirties'`, `'$touches'` → `IRBoolean`
- `'$valid'`, `'$touched'`, `'$dirty'`, `'$submitting'` → `boolean`

## Usage Example

### Get Form Validity

```tsx
import { Form, Field, useFormStore } from 'efx-forms';

const ValidityIndicator = () => {
  const valid = useFormStore('$valid');
  
  return (
    <div className={valid ? 'valid' : 'invalid'}>
      {valid ? '✓ Form is valid' : '✗ Form has errors'}
    </div>
  );
};

const MyForm = () => (
  <Form name="validation-form" onSubmit={console.log}>
    <Field name="email" Field={Input} label="Email" validators={[required(), email()]} />
    <ValidityIndicator />
  </Form>
);
```

### Get Submitting State

```tsx
import { Form, useFormStore } from 'efx-forms';

const SubmitButton = () => {
  const submitting = useFormStore('$submitting');
  
  return (
    <button type="submit" disabled={submitting}>
      {submitting ? 'Submitting...' : 'Submit'}
    </button>
  );
};
```

### Get Dirty State

```tsx
import { Form, useFormStore } from 'efx-forms';

const DirtyIndicator = () => {
  const dirty = useFormStore('$dirty');
  
  return dirty ? <span className="unsaved">Unsaved changes</span> : null;
};
```

### Get Specific Store by Name

```tsx
import { Form, useFormStore } from 'efx-forms';

const ErrorsDisplay = () => {
  const errors = useFormStore('$errors');
  
  return (
    <div className="errors">
      {Object.entries(errors).map(([field, error]) => (
        <div key={field} className="error">
          {field}: {error}
        </div>
      ))}
    </div>
  );
};
```

## When to Use

Use `useFormStore` when you need:
- A single specific form state property
- Minimal re-renders (only when that store changes)
- Direct access to effector store values
- Lightweight alternative to `useFormData`

## Related

- [`useFormStores`](./useFormStores.md) - Get multiple stores at once
- [`useFormData`](./useFormData.md) - Get all form state at once
- [`useFormValues`](./useFormValues.md) - Get values only

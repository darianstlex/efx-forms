# useFieldStore

Get a single field store value. Returns the current value of the specified effector store for a specific field.

## Import

```ts
import { useFieldStore } from 'efx-forms/useFieldStore';
```

## Signature

```ts
function useFieldStore<T extends UseFieldStoreProps>({
  store: T,
  name: string,
  formName?: string,
  defaultValue?: any,
}): UnitValue<IForm[T]>[string]
```

Available store names:
- `'$values'` - Field value
- `'$active'` - Field active state
- `'$activeValues'` - Field active value
- `'$errors'` - Field errors array
- `'$error'` - Field primary error
- `'$touches'` - Field touched state
- `'$dirties'` - Field dirty state

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `store` | `TFieldStore` | Yes | Name of the store to subscribe to |
| `name` | `string` | Yes | Field name (e.g., `"email"`, `"address[0]"`) |
| `formName` | `string` | No | Form name. Auto-detected from context |
| `defaultValue` | `any` | No | Default value if store is undefined |

## Return Type

The value type depends on the store:
- `'$values'`, `'$activeValues'` → `any` (field value)
- `'$active'`, `'$touches'`, `'$dirties'` → `boolean`
- `'$errors'` → `string[] | null`
- `'$error'` → `string | null`

## Usage Example

### Get Field Value

```tsx
import { Form, useFieldStore } from 'efx-forms';

const ValueDisplay = ({ fieldName }: { fieldName: string }) => {
  const value = useFieldStore({ store: '$values', name: fieldName });
  
  return <span>Current value: {String(value)}</span>;
};

const MyForm = () => (
  <Form name="display-form" onSubmit={console.log}>
    <Field name="email" Field={Input} label="Email" />
    <ValueDisplay fieldName="email" />
  </Form>
);
```

### Get Field Error

```tsx
import { Form, useFieldStore } from 'efx-forms';

const ErrorDisplay = ({ fieldName }: { fieldName: string }) => {
  const error = useFieldStore({ store: '$error', name: fieldName });
  
  return error ? <span className="error">{error}</span> : null;
};

const MyForm = () => (
  <Form name="error-form" onSubmit={console.log}>
    <Field name="email" Field={Input} label="Email" validators={[required(), email()]} />
    <ErrorDisplay fieldName="email" />
  </Form>
);
```

### Get Field Dirty State

```tsx
import { Form, useFieldStore } from 'efx-forms';

const DirtyIndicator = ({ fieldName }: { fieldName: string }) => {
  const dirty = useFieldStore({ store: '$dirties', name: fieldName });
  
  return dirty ? <span className="modified">●</span> : null;
};
```

### With Default Value

```tsx
import { Form, useFieldStore } from 'efx-forms';

const OptionalField = ({ fieldName }: { fieldName: string }) => {
  const value = useFieldStore({
    store: '$values',
    name: fieldName,
    defaultValue: '',
  });
  
  return <span>{value || '(empty)'}</span>;
};
```

## When to Use

Use `useFieldStore` when you need:
- A single specific field property
- Minimal re-renders (only when that store changes)
- Direct access to effector store values
- Lightweight alternative to `useFieldData`

## Related

- [`useFieldData`](./useFieldData.md) - Get all field state at once
- [`useFormStore`](./useFormStore.md) - Get form-level store value
- [`FieldDataProvider`](./field-data-provider.md) - Render prop alternative

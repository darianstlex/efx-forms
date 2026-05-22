# useFormStores

Get multiple form store values at once. Returns an array of values from the specified effector stores.

## Import

```ts
import { useFormStores } from 'efx-forms/useFormStores';
```

## Signature

```ts
function useFormStores<T extends TFormStoreKey[]>(
  stores: T,
  formName?: string
): { [K in keyof T]: T[K] extends TFormStoreKey ? UnitValue<IForm[T[K]]> : T[K] }
```

Available store names:
- `'$values'`, `'$errors'`, `'$active'`, `'$dirties'`, `'$touches'`
- `'$valid'`, `'$touched'`, `'$dirty'`, `'$submitting'`

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `stores` | `TFormStoreKey[]` | Yes | Array of store names to subscribe to |
| `formName` | `string` | No | Form name. Auto-detected from context if not provided |

## Return Type

Array of store values in the same order as the input array.

## Usage Example

### Get Multiple Stores

```tsx
import { Form, Field, useFormStores } from 'efx-forms';

const FormStatus = () => {
  const [values, errors, dirty, valid] = useFormStores([
    '$values',
    '$errors',
    '$dirty',
    '$valid',
  ]);
  
  return (
    <div className="form-status">
      <p>Fields: {Object.keys(values).length}</p>
      <p>Errors: {Object.keys(errors).length}</p>
      <p>Dirty: {String(dirty)}</p>
      <p>Valid: {String(valid)}</p>
    </div>
  );
};

const MyForm = () => (
  <Form name="status-form" onSubmit={console.log}>
    <Field name="name" Field={Input} label="Name" />
    <Field name="email" Field={Input} label="Email" />
    <FormStatus />
  </Form>
);
```

### Conditional Rendering Based on Multiple States

```tsx
import { Form, useFormStores } from 'efx-forms';

const SubmitWarning = () => {
  const [dirty, valid, submitting] = useFormStores([
    '$dirty',
    '$valid',
    '$submitting',
  ]);
  
  if (submitting) {
    return <p className="submitting">Submitting...</p>;
  }
  
  if (!dirty) {
    return <p className="info">Make changes before submitting</p>;
  }
  
  if (!valid) {
    return <p className="error">Fix errors before submitting</p>;
  }
  
  return <p className="success">Ready to submit!</p>;
};
```

### Outside Form Context

```tsx
import { useFormStores } from 'efx-forms/useFormStores';

const ExternalMonitor = () => {
  const [values, errors] = useFormStores(['$values', '$errors'], 'my-form');
  
  return (
    <div>
      <h4>Values:</h4>
      <pre>{JSON.stringify(values)}</pre>
      <h4>Errors:</h4>
      <pre>{JSON.stringify(errors)}</pre>
    </div>
  );
};
```

### Selective Subscriptions

```tsx
import { Form, useFormStores } from 'efx-forms';

const MinimalIndicator = () => {
  // Only subscribe to what you need
  const [valid, submitting] = useFormStores(['$valid', '$submitting']);
  
  return (
    <button type="submit" disabled={!valid || submitting}>
      {submitting ? '...' : 'Submit'}
    </button>
  );
};
```

## When to Use

Use `useFormStores` when you need:
- Multiple specific form state properties
- More control than `useFormData` but less than full form instance
- To minimize re-renders by selecting only needed stores
- Array-based access to store values

## Related

- [`useFormStore`](./useFormStore.md) - Get single store value
- [`useFormData`](./useFormData.md) - Get all form state as object
- [`useFormInstance`](./useFormInstance.md) - Get complete form instance

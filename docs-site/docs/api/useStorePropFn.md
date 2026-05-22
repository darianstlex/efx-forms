# useStorePropFn

Get a computed value from any effector store using a custom getter function. Subscribes to store changes and applies the getter.

## Import

```ts
import { useStorePropFn } from 'efx-forms/useStorePropFn';
```

## Signature

```ts
function useStorePropFn<S extends Store<any>>(
  store: S,
  getter: (value: UnitValue<S>) => any,
  defaultValue?: any
): UnitValue<S>[string]
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `store` | `Store<any>` | Yes | Effector store to subscribe to |
| `getter` | `(value: UnitValue<S>) => any` | Yes | Function to compute value from store |
| `defaultValue` | `any` | No | Default value if getter returns undefined |

## Return Type

The computed value from the getter function. Type is `UnitValue<S>[string]`.

## Usage Example

### Compute Derived Value

```tsx
import { Form, useStorePropFn } from 'efx-forms';
import { useFormInstance } from 'efx-forms';

const ErrorCount = () => {
  const form = useFormInstance();
  const errorCount = useStorePropFn(
    form.$errors,
    (errors) => Object.keys(errors).length,
    0
  );
  
  return <span>{errorCount} errors</span>;
};

const MyForm = () => (
  <Form name="count-form" onSubmit={console.log}>
    <Field name="email" Field={Input} label="Email" validators={[required(), email()]} />
    <ErrorCount />
  </Form>
);
```

### Transform Store Value

```tsx
import { useStorePropFn } from 'efx-forms/useStorePropFn';

const FormattedValues = () => {
  const form = useFormInstance();
  const valuesString = useStorePropFn(
    form.$values,
    (values) => JSON.stringify(values, null, 2),
    '{}'
  );
  
  return <pre>{valuesString}</pre>;
};
```

### Check if Any Field is Dirty

```tsx
import { useStorePropFn } from 'efx-forms/useStorePropFn';

const DirtyIndicator = () => {
  const form = useFormInstance();
  const hasDirty = useStorePropFn(
    form.$dirties,
    (dirties) => Object.values(dirties).some(Boolean),
    false
  );
  
  return hasDirty ? <span>Unsaved changes</span> : null;
};
```

### Filter Store Values

```tsx
import { useStorePropFn } from 'efx-forms/useStorePropFn';

const ValidFields = () => {
  const form = useFormInstance();
  const validFields = useStorePropFn(
    form.$values,
    (values) => Object.entries(values)
      .filter(([_, value]) => value !== '' && value !== null)
      .map(([key]) => key),
    []
  );
  
  return (
    <div>
      <h4>Completed fields:</h4>
      <ul>{validFields.map(f => <li key={f}>{f}</li>)}</ul>
    </div>
  );
};
```

## When to Use

Use `useStorePropFn` when you need:
- A computed/derived value from a store
- To transform store data before using it
- More flexibility than simple property access
- To avoid re-renders with custom comparison logic

## Related

- [`useStoreProp`](./useStoreProp.md) - Get simple property from store
- [`useStoreWatch`](./useStoreWatch.md) - Watch store changes
- [`useFormStore`](./useFormStore.md) - Get form store value

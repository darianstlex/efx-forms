# useStoreProp

Get a property value from any effector store. Subscribes to store changes and returns the value at the specified key.

## Import

```ts
import { useStoreProp } from 'efx-forms/useStoreProp';
```

## Signature

```ts
function useStoreProp<S extends Store<any>>(
  store: S,
  prop: string,
  defaultValue?: any
): UnitValue<S>[string]
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `store` | `Store<any>` | Yes | Effector store to subscribe to |
| `prop` | `string` | Yes | Property/key name to extract from store value |
| `defaultValue` | `any` | No | Default value if property is undefined |

## Return Type

The value at the specified property key in the store. Type is `UnitValue<S>[string]`.

## Usage Example

### Get Value from Form Store

```tsx
import { Form, useStoreProp } from 'efx-forms';
import { useFormInstance } from 'efx-forms';

const FieldError = ({ fieldName }: { fieldName: string }) => {
  const form = useFormInstance();
  const error = useStoreProp(form.$error, fieldName, null);
  
  return error ? <span className="error">{error}</span> : null;
};

const MyForm = () => (
  <Form name="error-form" onSubmit={console.log}>
    <Field name="email" Field={Input} label="Email" validators={[required(), email()]} />
    <FieldError fieldName="email" />
  </Form>
);
```

### Get Nested Property

```tsx
import { useStoreProp } from 'efx-forms/useStoreProp';

const NestedValue = ({ formName, fieldName }: { formName: string; fieldName: string }) => {
  const form = useFormInstance(formName);
  const value = useStoreProp(form.$values, fieldName, '');
  
  return <span>{value}</span>;
};
```

### With Default Value

```tsx
import { useStoreProp } from 'efx-forms/useStoreProp';

const OptionalValue = ({ fieldName }: { fieldName: string }) => {
  const form = useFormInstance();
  const value = useStoreProp(form.$activeValues, fieldName, false);
  
  return <span>Active: {String(value)}</span>;
};
```

### Custom Store Subscription

```tsx
import { Store } from 'effector';
import { useStoreProp } from 'efx-forms/useStoreProp';

const CustomStoreValue = ({ store, key }: { store: Store<IRValues>; key: string }) => {
  const value = useStoreProp(store, key, null);
  
  return <div>{key}: {String(value)}</div>;
};
```

## When to Use

Use `useStoreProp` when you need:
- A single property from an effector store
- To avoid re-renders from unrelated store changes
- To build custom hooks like `useFieldData`
- Direct store subscription with property extraction

## Related

- [`useStorePropFn`](./useStorePropFn.md) - Get computed value with custom getter
- [`useStoreWatch`](./useStoreWatch.md) - Watch store changes
- [`useFieldStore`](./useFieldStore.md) - Get field store value (uses useStoreProp internally)

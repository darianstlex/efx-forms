# useStoreWatch

Watch an effector store for changes. Executes a callback whenever the store value updates.

## Import

```ts
import { useStoreWatch } from 'efx-forms/useStoreWatch';
```

## Signature

```ts
function useStoreWatch<S extends Store<any>>(
  store: S,
  onUpdate: (value: UnitValue<S>) => void
): void
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `store` | `Store<any>` | Yes | Effector store to watch |
| `onUpdate` | `(value: UnitValue<S>) => void` | Yes | Callback executed on store changes |

## Return Type

`void` - This hook is for side effects only, it doesn't return a value.

## Usage Example

### Log Store Changes

```tsx
import { Form, useStoreWatch } from 'efx-forms';
import { useFormInstance } from 'efx-forms';

const FormLogger = () => {
  const form = useFormInstance();
  
  useStoreWatch(form.$values, (values) => {
    console.log('Values changed:', values);
  });
  
  return null;
};

const MyForm = () => (
  <Form name="log-form" onSubmit={console.log}>
    <Field name="name" Field={Input} label="Name" />
    <FormLogger />
  </Form>
);
```

### Trigger Side Effects

```tsx
import { useStoreWatch } from 'efx-forms/useStoreWatch';

const AutoSave = () => {
  const form = useFormInstance();
  
  useStoreWatch(form.$values, (values) => {
    // Auto-save to localStorage
    localStorage.setItem('form-draft', JSON.stringify(values));
  });
  
  return null;
};
```

### Validate External Data

```tsx
import { useStoreWatch } from 'efx-forms/useStoreWatch';

const ExternalValidator = () => {
  const form = useFormInstance();
  
  useStoreWatch(form.$values, (values) => {
    // Check against external API
    if (values.email) {
      checkEmailAvailability(values.email);
    }
  });
  
  return null;
};
```

### Update Another Store

```tsx
import { useStoreWatch } from 'efx-forms/useStoreWatch';

const SyncValues = () => {
  const form = useFormInstance();
  const externalStore = useUnit(externalState);
  
  useStoreWatch(form.$values, (values) => {
    // Sync form values to external store
    externalStore.set({ ...values, synced: true });
  });
  
  return null;
};
```

### Debounced Watch

```tsx
import { useStoreWatch } from 'efx-forms/useStoreWatch';
import { debounce } from 'lodash';
import { useRef } from 'react';

const DebouncedWatch = () => {
  const form = useFormInstance();
  const debouncedSave = useRef(debounce((values) => {
    saveToServer(values);
  }, 500));
  
  useStoreWatch(form.$values, (values) => {
    debouncedSave.current(values);
  });
  
  return null;
};
```

## When to Use

Use `useStoreWatch` when you need:
- To trigger side effects on store changes
- To sync store values with external systems
- To log or debug store updates
- Building custom hooks like `useStoreProp`

## Related

- [`useStoreProp`](./useStoreProp.md) - Get property from store (uses useStoreWatch)
- [`useStorePropFn`](./useStorePropFn.md) - Get computed value (uses useStoreWatch)
- [`useFormInstance`](./useFormInstance.md) - Get form instance to watch its stores

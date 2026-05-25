# useFormInstance

Get raw form instance with all stores and events. Returns the complete form object with direct access to effector stores.

## Import

```ts
import { useFormInstance } from 'efx-forms';
```

## Signature

```ts
function useFormInstance(formName?: string): IForm
```

Where `IForm` contains:

```ts
{
  // Stores
  $values: Store<IRValues>;
  $errors: Store<IRErrors>;
  $active: Store<IRBoolean>;
  $dirties: Store<IRBoolean>;
  $touches: Store<IRBoolean>;
  $submitting: Store<boolean>;
  $valid: Store<boolean>;
  $touched: Store<boolean>;
  $dirty: Store<boolean>;
  
  // Events
  change: EventCallable<IValuePayload>;
  reset: EventCallable<void>;
  erase: EventCallable<void>;
  resetField: EventCallable<string>;
  resetUntouched: EventCallable<string[]>;
  setActive: EventCallable<IBooleanPayload>;
  setValues: EventCallable<IRValues>;
  setErrors: EventCallable<IRErrors>;
  replaceErrors: EventCallable<IRErrors>;
  validate: EventCallable<IValidationParams>;
  
  // Effects
  submit: Effect<ISubmitArgs, ISubmitResponseSuccess, ISubmitResponseError>;
  
  // Config
  setConfig: (cfg: IFormConfig) => void;
  setFieldConfig: (cfg: IFieldConfig) => void;
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `formName` | `string` | No | Form name. Auto-detected from context if not provided. Required when used outside `<Form>` context or targeting a different form. |

## Return Type

Complete `IForm` instance with direct access to all effector stores, events, and effects.

## Usage Example

### Accessing Raw Stores

```tsx
import { Form, useFormInstance } from 'efx-forms';
import { useStore } from 'effector-react';

const FormDebug = () => {
  const form = useFormInstance();
  const values = useStore(form.$values);
  const errors = useStore(form.$errors);
  const dirty = useStore(form.$dirty);
  
  return (
    <div>
      <pre>Dirty: {String(dirty)}</pre>
      <pre>Values: {JSON.stringify(values)}</pre>
      <pre>Errors: {JSON.stringify(errors)}</pre>
    </div>
  );
};

const MyForm = () => (
  <Form name="debug-form" onSubmit={console.log}>
    <FormDebug />
  </Form>
);
```

### Outside Form Context

```tsx
import { useFormInstance } from 'efx-forms';

const ExternalSubmit = () => {
  const form = useFormInstance('my-form');
  
  const handleSubmit = () => {
    form.submit({});
  };
  
  return <button onClick={handleSubmit}>Submit External</button>;
};
```

### Watching Store Changes

```tsx
import { Form, useFormInstance } from 'efx-forms';
import { useEffect } from 'react';

const FormWatcher = () => {
  const form = useFormInstance();
  
  useEffect(() => {
    const unsubscribe = form.$values.watch((values) => {
      console.log('Values changed:', values);
    });
    
    return unsubscribe;
  }, [form]);
  
  return null;
};
```

## When to Use

Use `useFormInstance` when you need:
- Direct access to effector stores for custom subscriptions
- Low-level control over form state
- To integrate with custom effector logic
- Access to both stores and events in one hook

## Related

- [`useForm`](./useForm.md) - Higher-level hook with plain objects
- [`useFormData`](./useFormData.md) - Get form state stores only
- [`Form Component`](./form-component.md) - Form context provider

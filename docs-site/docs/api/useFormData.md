# useFormData

Get form state stores. Returns reactive form data including values, errors, active fields, and form status.

## Import

```ts
import { useFormData } from 'efx-forms/useFormData';
```

## Signature

```ts
function useFormData(formName?: string): {
  // Form state stores
  active: Store<Record<string, boolean>>;
  activeOnly: Store<Record<string, true>>;
  activeValues: Store<Record<string, any>>;
  dirties: Store<Record<string, boolean>>;
  dirty: Store<boolean>;
  error: Store<Record<string, string | null>>;
  errors: Store<Record<string, string[]>>;
  submitting: Store<boolean>;
  touched: Store<boolean>;
  touches: Store<Record<string, boolean>>;
  values: Store<Record<string, any>>;
  valid: Store<boolean>;
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `formName` | `string` | No | Form name. Auto-detected from context if not provided. Required when used outside `<Form>` context or targeting a different form. |

## Return Type

Object containing effector stores for form state. All properties are reactive stores that update when form state changes.

**Note**: Unlike `useForm`, this hook returns stores, not plain values. Use with `useUnit` from effector-react to subscribe to values in components.

## Usage Example

### Basic Usage with FormDataProvider

```tsx
import { Form, FormDataProvider } from 'efx-forms';
import { useFormData } from 'efx-forms/useFormData';

const FormDebug = () => (
  <FormDataProvider>
    {({ values, errors, dirty, valid }) => (
      <div>
        <pre>Values: {JSON.stringify(values)}</pre>
        <pre>Errors: {JSON.stringify(errors)}</pre>
        <span>Dirty: {String(dirty)}</span>
        <span>Valid: {String(valid)}</span>
      </div>
    )}
  </FormDataProvider>
);

const Page = () => (
  <Form name="user-form" onSubmit={console.log}>
    <FormDebug />
  </Form>
);
```

### Direct Hook Usage

```tsx
import { Form } from 'efx-forms';
import { useFormData } from 'efx-forms/useFormData';
import { useUnit } from 'effector-react';

const FormStatus = () => {
  const { submitting, valid, dirty } = useFormData();
  const isSubmitting = useUnit(submitting);
  const isValid = useUnit(valid);
  const isDirty = useUnit(dirty);
  
  return (
    <div>
      {isSubmitting && <span>Submitting...</span>}
      {!isValid && <span>Form has errors</span>}
      {isDirty && <span>Unsaved changes</span>}
    </div>
  );
};

const Page = () => (
  <Form name="contact-form" onSubmit={console.log}>
    <FormStatus />
  </Form>
);
```

### Accessing Active Values

```tsx
import { Form, FormDataProvider } from 'efx-forms';

const ActiveFieldsOnly = () => (
  <FormDataProvider>
    {({ activeValues, active }) => (
      <div>
        <h3>Active Fields</h3>
        <pre>{JSON.stringify(active, null, 2)}</pre>
        <h3>Active Values Only</h3>
        <pre>{JSON.stringify(activeValues, null, 2)}</pre>
      </div>
    )}
  </FormDataProvider>
);

const Page = () => (
  <Form name="dynamic-form" onSubmit={console.log}>
    <ActiveFieldsOnly />
  </Form>
);
```

### Tracking Form Touches

```tsx
import { Form, FormDataProvider } from 'efx-forms';

const TouchTracker = () => (
  <FormDataProvider>
    {({ touched, touches }) => (
      <div>
        <span>Form Touched: {String(touched)}</span>
        <pre>Touched Fields: {JSON.stringify(touches)}</pre>
      </div>
    )}
  </FormDataProvider>
);

const Page = () => (
  <Form name="survey-form" onSubmit={console.log}>
    <TouchTracker />
  </Form>
);
```

### Error Display Component

```tsx
import { Form, FormDataProvider } from 'efx-forms';

const ErrorSummary = () => (
  <FormDataProvider>
    {({ errors, error, valid }) => {
      if (valid) return null;
      
      return (
        <div className="error-summary">
          <h4>Please fix the following errors:</h4>
          <ul>
            {Object.entries(error).map(([field, msg]) => 
              msg && <li key={field}>{field}: {msg}</li>
            )}
          </ul>
          <pre>All Errors: {JSON.stringify(errors)}</pre>
        </div>
      );
    }}
  </FormDataProvider>
);

const Page = () => (
  <Form name="registration-form" onSubmit={console.log}>
    <ErrorSummary />
  </Form>
);
```

### Outside Form Context

```tsx
import { Form } from 'efx-forms';
import { useFormData } from 'efx-forms/useFormData';
import { useUnit } from 'effector-react';

const ExternalFormMonitor = () => {
  // Must provide formName when outside context
  const { values, submitting } = useFormData('checkout-form');
  const formValues = useUnit(values);
  const isSubmitting = useUnit(submitting);
  
  return (
    <div>
      <span>Checkout Status: {isSubmitting ? 'Processing' : 'Idle'}</span>
      <pre>Cart: {JSON.stringify(formValues)}</pre>
    </div>
  );
};

const Page = () => (
  <Form name="checkout-form" onSubmit={console.log}>
    {/* checkout fields */}
  </Form>
  <ExternalFormMonitor />
);
```

### Comparing useForm vs useFormData

```tsx
import { Form } from 'efx-forms';
import { useForm } from 'efx-forms/useForm';
import { useFormData } from 'efx-forms/useFormData';

// useForm - returns plain values (auto-subscribed)
const UseFormExample = () => {
  const { values, dirty } = useForm(); // Plain objects
  return <div>Values: {JSON.stringify(values)}</div>;
};

// useFormData - returns stores (manual subscription needed)
const UseFormDataExample = () => {
  const { values, dirty } = useFormData(); // Stores
  const vals = useUnit(values); // Subscribe manually
  const isDirty = useUnit(dirty);
  return <div>Values: {JSON.stringify(vals)}</div>;
};

// Use useForm for most cases
// Use useFormData when you need fine-grained store control
```

## Related

- [`useForm`](./useForm.md) - Get form data and methods combined (plain values)
- [`useFormValues`](./utilities.md#form-registry) - Get values store only
- [`useFormInstance`](./utilities.md#form-registry) - Get raw form instance
- [FormDataProvider](./utilities.md#form-registry) - Component wrapper using useFormData

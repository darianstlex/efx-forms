# useFormValues

Get form values only. Returns a plain object with current form values.

## Import

```ts
import { useFormValues } from 'efx-forms/useFormValues';
```

## Signature

```ts
function useFormValues(formName?: string): IRValues
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `formName` | `string` | No | Form name. Auto-detected from context if not provided |

## Return Type

Plain object containing current form values: `IRValues`

## Usage Example

### Display Form Values

```tsx
import { Form, Field } from 'efx-forms';
import { useFormValues } from 'efx-forms/useFormValues';

const FormValuesDisplay = () => {
  const values = useFormValues();
  
  return (
    <div>
      <h4>Current Values:</h4>
      <pre>{JSON.stringify(values, null, 2)}</pre>
    </div>
  );
};

const MyForm = () => (
  <Form name="display-form" onSubmit={console.log}>
    <Field name="name" Field={Input} label="Name" />
    <Field name="email" Field={Input} label="Email" />
    <FormValuesDisplay />
  </Form>
);
```

### Outside Form Context

```tsx
import { useFormValues } from 'efx-forms/useFormValues';

const ExternalMonitor = () => {
  const values = useFormValues('my-form');
  
  return (
    <div>
      <p>Form has {Object.keys(values).length} fields</p>
      <pre>{JSON.stringify(values)}</pre>
    </div>
  );
};
```

### Conditional Logic Based on Values

```tsx
import { Form, useFormValues } from 'efx-forms';

const SubmitButton = () => {
  const values = useFormValues();
  const hasValues = Object.keys(values).length > 0;
  const isComplete = values.name && values.email;
  
  return (
    <button type="submit" disabled={!isComplete}>
      Submit {hasValues ? `(${Object.keys(values).length} fields)` : ''}
    </button>
  );
};
```

## When to Use

Use `useFormValues` when you need:
- Only form values without other state (errors, dirty, etc.)
- Simple read-only access to form data
- To minimize re-renders (only updates when values change)
- Lightweight alternative to `useForm` or `useFormData`

## Related

- [`useForm`](./useForm.md) - Get all form data and methods
- [`useFormData`](./useFormData.md) - Get all form state stores
- [`FormDataProvider`](./form-data-provider.md) - Render prop alternative

# Hooks Overview

EFX-Forms provides a comprehensive set of React hooks for accessing form state, methods, and field data. All hooks work within the form context or can target specific forms by name.

## Available Hooks

### Form Hooks

| Hook | Description | Import |
|------|-------------|--------|
| [`useForm`](/docs/api/useForm) | Get form data and methods combined | `efx-forms/useForm` |
| [`useFormData`](/docs/api/useFormData) | Get form state stores (values, errors, etc.) | `efx-forms/useFormData` |
| [`useFormInstance`](/docs/api/useFormInstance) | Get raw form instance with all stores and events | `efx-forms` |
| [`useFormValues`](/docs/api/useFormValues) | Get form values only | `efx-forms/useFormValues` |
| [`useFormMethods`](/docs/api/useFormMethods) | Get form methods only (change, reset, submit, etc.) | `efx-forms/useFormMethods` |
| [`useFormStore`](/docs/api/useFormStore) | Get single form store by name | `efx-forms/useFormStore` |
| [`useFormStores`](/docs/api/useFormStores) | Get multiple form stores by name | `efx-forms/useFormStores` |

### Field Hooks

| Hook | Description | Import |
|------|-------------|--------|
| [`useField`](/docs/api/useField) | Get field data and methods combined | `efx-forms/useField` |
| [`useFieldData`](/docs/api/useFieldData) | Get field state (value, active, error, etc.) | `efx-forms/useFieldData` |
| [`useFieldStore`](/docs/api/useFieldStore) | Get single field store value | `efx-forms/useFieldStore` |

### Utility Hooks

| Hook | Description | Import |
|------|-------------|--------|
| [`useStoreProp`](/docs/api/useStoreProp) | Get property from any effector store | `efx-forms/useStoreProp` |
| [`useStorePropFn`](/docs/api/useStorePropFn) | Get computed value from store using getter function | `efx-forms/useStorePropFn` |

## Usage Pattern

All hooks accept an optional `formName` parameter. When used within a `<Form>` context, the form name is inferred automatically. When used outside context or targeting a different form, provide the `formName` explicitly.

```tsx
import { Form } from 'efx-forms';
import { useForm, useField } from 'efx-forms';

// Inside form context - formName inferred
const InsideForm = () => {
  const { values, change } = useForm();
  const { value, error } = useField('username');
  return <div>{value} - {error}</div>;
};

// Outside context - formName required
const OutsideForm = () => {
  const { values, submit } = useForm('my-form');
  const { value } = useField('email', 'my-form');
  return <button onClick={submit}>Submit</button>;
};

const Page = () => (
  <Form name="my-form" onSubmit={console.log}>
    <InsideForm />
    <OutsideForm />
  </Form>
);
```

## Related

- [Form Component](/docs/api/form)
- [Field Component](/docs/api/field)
- [FormDataProvider](/docs/api/form-data-provider)

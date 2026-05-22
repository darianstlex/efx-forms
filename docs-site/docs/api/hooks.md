# Hooks Overview

EFX-Forms provides a comprehensive set of React hooks for accessing form state, methods, and field data. All hooks work within the form context or can target specific forms by name.

## Available Hooks

### Form Hooks

| Hook | Description | Import |
|------|-------------|--------|
| [`useForm`](./useForm.md) | Get form data and methods combined | `efx-forms/useForm` |
| [`useFormData`](./useFormData.md) | Get form state stores (values, errors, etc.) | `efx-forms/useFormData` |
| [`useFormInstance`](./utilities.md#form-registry) | Get raw form instance with all stores and events | `efx-forms` |
| [`useFormValues`](./utilities.md#form-registry) | Get form values only | `efx-forms/useFormValues` |
| [`useFormMethods`](./utilities.md#form-registry) | Get form methods only (change, reset, submit, etc.) | `efx-forms/useFormMethods` |
| [`useFormStore`](./utilities.md#form-registry) | Get single form store by name | `efx-forms/useFormStore` |
| [`useFormStores`](./utilities.md#form-registry) | Get multiple form stores by name | `efx-forms/useFormStores` |

### Field Hooks

| Hook | Description | Import |
|------|-------------|--------|
| [`useField`](./useField.md) | Get field data and methods combined | `efx-forms/useField` |
| [`useFieldData`](./utilities.md#form-registry) | Get field state (value, active, error, etc.) | `efx-forms/useFieldData` |
| [`useFieldStore`](./utilities.md#form-registry) | Get single field store value | `efx-forms/useFieldStore` |

### Utility Hooks

| Hook | Description | Import |
|------|-------------|--------|
| [`useStoreProp`](./utilities.md#utility-functions) | Get property from any effector store | `efx-forms/useStoreProp` |
| [`useStorePropFn`](./utilities.md#utility-functions) | Get computed value from store using getter function | `efx-forms/useStorePropFn` |

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

- [Form Component](./form-component.md)
- [Field Component](./field-component.md)
- [Utilities](./utilities.md)

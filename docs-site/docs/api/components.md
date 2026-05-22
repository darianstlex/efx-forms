---
sidebar_position: 1
---

# Core Components Overview

EFX-Forms provides a set of React components for building forms with Effector state management. This page gives you a quick overview of all available components.

## Component List

| Component | Import Path | Description |
|-----------|-------------|-------------|
| [`Form`](./form-component.md) | `efx-forms` | Main form wrapper and context provider |
| [`Field`](./field-component.md) | `efx-forms` | Field wrapper with validation and state sync |
| [`FormDataProvider`](./utilities.md#form-registry) | `efx-forms/FormDataProvider` | Subscribe to form values and errors |
| [`FieldDataProvider`](./utilities.md#form-registry) | `efx-forms/FieldDataProvider` | Subscribe to individual field values |
| [`IfFormValues`](./utilities.md#form-registry) | `efx-forms/IfFormValues` | Conditional rendering based on form values |
| [`IfFieldValue`](./utilities.md#form-registry) | `efx-forms/IfFieldValue` | Conditional rendering based on field value |

## Basic Usage Pattern

All components work together within a form context:

```tsx
import { Form, Field } from 'efx-forms';
import { FormDataProvider } from 'efx-forms/FormDataProvider';
import { required, email } from 'efx-forms/validators';

const Input = ({ label, error, value, onChange, onBlur, ...props }) => (
  <div>
    <label>{label}</label>
    <input value={value || ''} onChange={onChange} onBlur={onBlur} {...props} />
    {error && <span className="error">{error}</span>}
  </div>
);

const TextField = (props) => <Field Field={Input} {...props} />;

function MyForm() {
  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  return (
    <Form name="contact-form" onSubmit={handleSubmit}>
      <TextField name="name" label="Name" validators={[required()]} />
      <TextField name="email" label="Email" validators={[required(), email()]} />
      
      <FormDataProvider>
        {({ values, errors }) => (
          <pre>{JSON.stringify({ values, errors }, null, 2)}</pre>
        )}
      </FormDataProvider>
      
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Component Categories

### Form Components

- **Form**: The root component that creates form context and manages state
- **Field**: Individual field wrapper that connects inputs to form state

### Data Provider Components

- **FormDataProvider**: Access form-wide data (values, errors, state)
- **FieldDataProvider**: Access individual field data (value, active, touched)

### Conditional Components

- **IfFormValues**: Show/hide content based on form values
- **IfFieldValue**: Show/hide content based on single field value

## Next Steps

- [Form Component - Detailed API](./form-component.md)
- [Field Component - Detailed API](./field-component.md)
- [Getting Started Guide](../intro.md)

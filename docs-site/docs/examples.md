---
sidebar_position: 4
---

# Examples

Practical examples showing common form patterns with efx-forms.

## Quick Links

- [Basic Form](/docs/examples/basic-form) - Simple Form + Field setup
- [Validation](/docs/examples/validation) - Form validation patterns
- [Advanced Patterns](/docs/examples/advanced) - Conditional fields, dynamic forms

## Full Working Examples

For complete working examples, see the example pages in this documentation:

- [Basic Form](/docs/examples/basic-form) - Simple Form + Field setup
- [Validation](/docs/examples/validation) - Form validation patterns
- [Advanced Patterns](/docs/examples/advanced) - Conditional fields, dynamic forms

## Common Patterns

### Basic Form Structure

Every form needs a `name` prop and an `onSubmit` handler:

```jsx
import { Form, Field } from 'efx-forms';

function MyForm() {
  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <Form name="my-form" onSubmit={handleSubmit}>
      <Field name="fieldName" Field={MyInput} />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

### Validation

Add validators at form level or field level:

```jsx
import { Form, Field } from 'efx-forms';
import { required, email } from 'efx-forms/validators';

function ValidatedForm() {
  return (
    <Form name="login-form" validators={{ email: [required(), email()] }}>
      <Field name="email" Field={Input} />
      <Field name="password" Field={Input} validators={[required()]} />
      <button type="submit">Login</button>
    </Form>
  );
}
```

### Conditional Rendering

Show/hide fields based on form values:

```jsx
import { Form, Field, IfFormValues } from 'efx-forms';

function ConditionalForm() {
  return (
    <Form name="signup-form">
      <Field name="age" Field={NumberInput} />
      <IfFormValues check={({ age }) => age >= 18}>
        <Field name="license" Field={TextInput} label="Driver's License" />
      </IfFormValues>
      <button type="submit">Submit</button>
    </Form>
  );
}
```

### Form Data Subscription

Access form values in real-time:

```jsx
import { Form, FormDataProvider } from 'efx-forms';

function FormWithPreview() {
  return (
    <Form name="preview-form">
      <Field name="name" Field={Input} />
      <FormDataProvider>
        {({ values }) => <pre>{JSON.stringify(values, null, 2)}</pre>}
      </FormDataProvider>
    </Form>
  );
}
```

---
sidebar_position: 3
---

# Quickstart

This guide walks you through creating a basic form with validation using EFX-Forms.

## Basic Form Example

Here's a complete working form with two fields and validation:

```tsx
import { Form, Field } from 'efx-forms';
import { FormDataProvider } from 'efx-forms/FormDataProvider';
import { required, email } from 'efx-forms/validators';

// Create a reusable input component
const Input = ({ id, label, error, value, ...props }) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <input 
      id={id} 
      value={value || ''} 
      type="text" 
      {...props} 
    />
    {error && <span style={{ color: 'red' }}>{error}</span>}
  </div>
);

// Wrap it with Field to create a form field
const TextField = (props) => <Field Field={Input} {...props} />;

// Define validators per field
const validators = {
  name: [required()],
};

const Page = () => {
  const submit = (values) => {
    console.log('Form submitted:', values);
  };

  return (
    <Form 
      name="user-form" 
      onSubmit={submit} 
      validators={validators}
    >
      <TextField name="name" label="Name" />
      
      <TextField
        name="email"
        label="Email"
        type="email"
        validators={[
          required({ msg: 'Email is required' }),
          email(),
        ]}
      />
      
      <button type="submit">Submit</button>
      
      {/* Live preview of form values */}
      <FormDataProvider>
        {({ values }) => (
          <pre>{JSON.stringify(values, null, 2)}</pre>
        )}
      </FormDataProvider>
    </Form>
  );
};
```

## How It Works

### Form Component

The `Form` component is the container that manages form state:

- `name`: Unique identifier for the form (required)
- `onSubmit`: Callback invoked with form values on successful validation
- `validators`: Validation rules per field

### Field Component

The `Field` component wraps your input component and provides:

- Value binding from form state
- Error display
- Validation triggering
- Active/dirty/touched state tracking

Required props:
- `name`: Field identifier (e.g., `"email"`)
- `Field`: The React component to render as the input

### Validators

EFX-Forms includes built-in validators:

```tsx
import { required, email } from 'efx-forms/validators';

// Basic usage
validators={{
  name: [required()],
  email: [required(), email()],
}}

// Custom error message
validators={{
  email: [required({ msg: 'Email is required' })],
}}
```

## Form Values Structure

Form values are stored flat internally:

```ts
// Internal flat structure
{
  'name': 'John',
  'email': 'john@test.com',
  'address[0]': 'First Line',
  'address[1]': 'Second Line',
}
```

Use `shapeFy` from utilities to convert to nested objects:

```ts
import { shapeFy } from 'efx-forms/utils';

// Shaped structure
{
  name: 'John',
  email: 'john@test.com',
  address: ['First Line', 'Second Line'],
}
```

## Next Steps

- Learn about [Form and Field props](./api/form-field.md) in the API reference
- Explore [conditional rendering](./guides/conditional-rendering.md) with `IfFormValues`
- Check out [custom validators](./guides/validation.md) guide

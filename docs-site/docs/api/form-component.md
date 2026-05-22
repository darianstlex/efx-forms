---
sidebar_position: 2
---

# Form Component

The `Form` component is the main wrapper for EFX-Forms. It creates the form context, manages form state using Effector stores, and handles validation and submission.

## Import

```tsx
import { Form } from 'efx-forms';
```

## Type Signature

```ts
interface FormProps {
  // Required
  name: string;
  
  // Optional
  onSubmit?: (values: Record<string, any>) => void | Promise<Record<string, any>>;
  skipClientValidation?: boolean;
  initialValues?: Record<string, any>;
  keepOnUnmount?: boolean;
  serialize?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  disableFieldsReinit?: boolean;
  validators?: Record<string, Array<(value: any, values: Record<string, any>) => string | false>>;
  
  // HTML form attributes
  children?: React.ReactNode;
  [key: string]: any;
}
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `name` | `string` | - | ✅ Yes | Form name. Used to get form instance outside of context |
| `onSubmit` | `(values) => void \| Promise` | - | No | Submit handler. Called with flat form values on validation success |
| `skipClientValidation` | `boolean` | `false` | No | Skip client-side validation on submit |
| `initialValues` | `Record<string, any>` | - | No | Initial form values. Field `initialValue` takes priority |
| `keepOnUnmount` | `boolean` | `false` | No | Keep form data when component unmounts |
| `serialize` | `boolean` | `false` | No | Serialize stores. Initialized only once on form creation |
| `validateOnBlur` | `boolean` | `true` | No | Validate fields on blur |
| `validateOnChange` | `boolean` | `false` | No | Validate fields on change |
| `disableFieldsReinit` | `boolean` | - | No | Disable reinit when `initialValues` change |
| `validators` | `Record<string, validator[]>` | - | No | Field validators config. Field-level validators take priority |
| `children` | `ReactNode` | - | No | Form children |

## Basic Usage

```tsx
import { Form, Field } from 'efx-forms';
import { required } from 'efx-forms/validators';

const Input = ({ label, error, value, onChange, onBlur, ...props }) => (
  <div>
    <label>{label}</label>
    <input value={value || ''} onChange={onChange} onBlur={onBlur} {...props} />
    {error && <span>{error}</span>}
  </div>
);

const TextField = (props) => <Field Field={Input} {...props} />;

function MyForm() {
  const handleSubmit = (values) => {
    console.log(values);
    // { name: 'John', email: 'john@test.com' }
  };

  return (
    <Form name="user-form" onSubmit={handleSubmit}>
      <TextField name="name" label="Name" validators={[required()]} />
      <TextField name="email" label="Email" />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Form Values Structure

Form values are stored in flat format:

```ts
// Flat format (internal)
values = {
  'name': 'John',
  'email': 'john@test.com',
  'address[0]': 'First Line',
  'address[1]': 'Second Line',
  'user.name': 'Jane',
}

// Use shapeFy utility to convert to nested
import { shapeFy } from 'efx-forms/utils';

const nested = shapeFy(values);
// {
//   name: 'John',
//   email: 'john@test.com',
//   address: ['First Line', 'Second Line'],
//   user: { name: 'Jane' }
// }
```

## Async Submit with Error Handling

```tsx
<Form
  name="login-form"
  onSubmit={async (values) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const errors = await response.json();
        // Reject with errors per field
        throw errors;
        // { 'email': 'Email already exists' }
      }
    } catch (errors) {
      // Errors will be displayed on corresponding fields
      throw errors;
    }
  }}
>
  <TextField name="email" label="Email" />
  <TextField name="password" label="Password" type="password" />
  <button type="submit">Login</button>
</Form>
```

## Initial Values

```tsx
<Form
  name="edit-form"
  initialValues={{
    name: 'John Doe',
    email: 'john@example.com',
  }}
  onSubmit={(values) => console.log(values)}
>
  <TextField name="name" label="Name" />
  <TextField name="email" label="Email" />
  <button type="submit">Update</button>
</Form>
```

## Validation Configuration

```tsx
import { required, email, min, max } from 'efx-forms/validators';

<Form
  name="registration-form"
  validators={{
    name: [required()],
    email: [
      required({ msg: 'Email is required' }),
      email(),
    ],
    age: [
      min(18, { msg: 'Must be 18 or older' }),
      max(120, { msg: 'Invalid age' }),
    ],
  }}
  onSubmit={(values) => console.log(values)}
>
  <TextField name="name" label="Name" />
  <TextField name="email" label="Email" />
  <TextField name="age" label="Age" type="number" />
  <button type="submit">Register</button>
</Form>
```

## Validation Behavior

Control when validation triggers:

```tsx
// Validate on blur (default)
<Form name="form1" validateOnBlur={true} validateOnChange={false}>
  <TextField name="email" />
</Form>

// Validate on change
<Form name="form2" validateOnBlur={false} validateOnChange={true}>
  <TextField name="password" />
</Form>

// Validate on both
<Form name="form3" validateOnBlur={true} validateOnChange={true}>
  <TextField name="username" />
</Form>
```

## Keep Form Data on Unmount

```tsx
// Form data persists between navigation
<Form name="wizard-step-1" keepOnUnmount={true}>
  <TextField name="step1-field" />
</Form>
```

## Skip Validation

```tsx
// Skip client validation entirely
<Form name="raw-form" skipClientValidation={true}>
  <TextField name="data" />
  <button type="submit">Submit without validation</button>
</Form>
```

## Access Form Instance

Get form instance outside component:

```tsx
import { getForm } from 'efx-forms';

const form = getForm({ name: 'my-form' });

// Access stores
form.$values;      // Store<Record<string, any>>
form.$errors;      // Store<Record<string, string[]>>
form.$valid;       // Store<boolean>
form.$submitting;  // Store<boolean>

// Call methods
form.reset();
form.setValues({ name: 'John' });
form.validate();
```

## Related

- [Field Component](./field-component.md)
- [Utilities](./utilities.md#form-registry)
- [Validators](./utilities.md#validators)
- [Hooks](./hooks.md)

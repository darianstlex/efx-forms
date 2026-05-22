---
sidebar_position: 1
---

# Basic Form Example

Getting started with Form and Field components.

## Minimal Example

The simplest form with one field:

```jsx
import { Form, Field } from 'efx-forms';

function Input({ id, label, value, error, ...props }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} value={value || ''} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

function BasicForm() {
  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  return (
    <Form name="basic-form" onSubmit={handleSubmit}>
      <Field name="username" Field={Input} label="Username" />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Complete Form with Multiple Fields

A more complete example with different field types:

```jsx
import { Form, Field } from 'efx-forms';
import { required, email } from 'efx-forms/validators';

function Input({ id, label, value, error, type = 'text', ...props }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input 
        id={id} 
        type={type}
        value={value || ''} 
        {...props} 
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

function TextField(props) {
  return <Field Field={Input} {...props} />;
}

function RegistrationForm() {
  const handleSubmit = (values) => {
    // values is flat: { name: 'John', email: 'john@example.com' }
    console.log(values);
  };

  return (
    <Form 
      name="registration-form" 
      onSubmit={handleSubmit}
      validators={{
        name: [required()],
        email: [required(), email()],
      }}
    >
      <TextField name="name" label="Full Name" />
      <TextField name="email" label="Email" type="email" />
      <TextField name="password" label="Password" type="password" />
      <button type="submit">Register</button>
    </Form>
  );
}
```

## Form with Initial Values

Pre-populate form fields:

```jsx
import { Form, Field } from 'efx-forms';

function EditForm() {
  const initialValues = {
    username: 'john_doe',
    email: 'john@example.com',
  };

  return (
    <Form 
      name="edit-form" 
      initialValues={initialValues}
      onSubmit={(values) => console.log(values)}
    >
      <Field name="username" Field={Input} label="Username" />
      <Field name="email" Field={Input} label="Email" type="email" />
      <button type="submit">Update</button>
    </Form>
  );
}
```

## Array Fields

Handle indexed fields (arrays):

```jsx
import { Form, Field } from 'efx-forms';

function AddressForm() {
  return (
    <Form name="address-form" onSubmit={(values) => console.log(values)}>
      {[0, 1, 2].map((idx) => (
        <Field
          key={idx}
          name={`address[${idx}]`}
          Field={Input}
          label={`Address Line ${idx + 1}`}
        />
      ))}
      <button type="submit">Submit</button>
    </Form>
  );
}

// Submitted values:
// { 'address[0]': '123 Main St', 'address[1]': 'Apt 4B', 'address[2]': 'New York, NY' }
// Use shapeFy() to convert to nested: { address: ['123 Main St', 'Apt 4B', 'New York, NY'] }
```

## Accessing Form Values

Display form values in real-time:

```jsx
import { Form, Field, FormDataProvider } from 'efx-forms';
import { shapeFy } from 'efx-forms/utils';

function FormWithPreview() {
  return (
    <Form name="preview-form" onSubmit={(values) => console.log(values)}>
      <Field name="name" Field={Input} label="Name" />
      <Field name="email" Field={Input} label="Email" type="email" />
      
      <FormDataProvider>
        {({ values }) => (
          <div className="preview">
            <h4>Live Preview</h4>
            <pre>{JSON.stringify(values, null, 2)}</pre>
            <h4>Shaped Values</h4>
            <pre>{JSON.stringify(shapeFy(values), null, 2)}</pre>
          </div>
        )}
      </FormDataProvider>
      
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Next Steps

- [Validation Examples](/docs/examples/validation) - Add validation to your forms
- [Advanced Patterns](/docs/examples/advanced) - Conditional fields and dynamic forms

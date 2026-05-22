---
sidebar_position: 2
---

# Validation Examples

Form validation patterns using built-in and custom validators.

## Built-in Validators

Import validators from the validators sub-path:

```jsx
import { Form, Field } from 'efx-forms';
import { required, email, min, max } from 'efx-forms/validators';

function Input({ id, label, value, error, ...props }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} value={value || ''} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

function ValidatedForm() {
  return (
    <Form 
      name="validated-form"
      validators={{
        email: [required(), email()],
        age: [min(18), max(99)],
      }}
      onSubmit={(values) => console.log(values)}
    >
      <Field name="email" Field={Input} label="Email" type="email" />
      <Field name="age" Field={Input} label="Age" type="number" />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Custom Error Messages

Override default error messages:

```jsx
import { required, email } from 'efx-forms/validators';

function CustomMessagesForm() {
  return (
    <Form 
      name="custom-messages-form"
      validators={{
        email: [
          required({ msg: 'Email address is required' }),
          email({ msg: 'Please enter a valid email address' }),
        ],
        password: [
          required({ msg: 'Password cannot be empty' }),
        ],
      }}
      onSubmit={(values) => console.log(values)}
    >
      <Field name="email" Field={Input} label="Email" type="email" />
      <Field name="password" Field={Input} label="Password" type="password" />
      <button type="submit">Login</button>
    </Form>
  );
}
```

## Field-Level Validators

Override form-level validators at the field level:

```jsx
import { Form, Field } from 'efx-forms';
import { required } from 'efx-forms/validators';

function FieldOverrideForm() {
  return (
    <Form 
      name="override-form"
      validators={{
        username: [required({ msg: 'Username is required' })],
      }}
      onSubmit={(values) => console.log(values)}
    >
      {/* Uses form-level validator */}
      <Field name="username" Field={Input} label="Username" />
      
      {/* Overrides with custom message */}
      <Field 
        name="password" 
        Field={Input} 
        label="Password" 
        type="password"
        validators={[required({ msg: 'Password must have at least 8 characters' })]}
      />
      
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Custom Validator Functions

Create your own validator functions:

```jsx
import { Form, Field } from 'efx-forms';

// Validator function returns error message string or false for valid
const confirmPassword = (value, values) => {
  if (value !== values.password) {
    return 'Passwords do not match';
  }
  return false; // valid
};

const minLength = (min) => (value) => {
  if (value && value.length < min) {
    return `Must be at least ${min} characters`;
  }
  return false;
};

function CustomValidatorForm() {
  return (
    <Form 
      name="custom-validator-form"
      validators={{
        password: [minLength(8)],
        confirmPassword: [confirmPassword],
      }}
      onSubmit={(values) => console.log(values)}
    >
      <Field name="password" Field={Input} label="Password" type="password" />
      <Field name="confirmPassword" Field={Input} label="Confirm Password" type="password" />
      <button type="submit">Register</button>
    </Form>
  );
}
```

## Validation Behavior

Control when validation runs:

```jsx
import { Form, Field } from 'efx-forms';
import { required } from 'efx-forms/validators';

function ValidationBehaviorForm() {
  return (
    <Form 
      name="behavior-form"
      validateOnBlur={true}    // Validate on blur (default)
      validateOnChange={false} // Validate on change (default: false)
      validators={{
        username: [required()],
      }}
      onSubmit={(values) => console.log(values)}
    >
      <Field name="username" Field={Input} label="Username" />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Server-Side Error Handling

Handle errors returned from submit:

```jsx
import { Form, Field } from 'efx-forms';
import { required } from 'efx-forms/validators';

async function submitForm(values) {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(values),
    });
    
    if (!response.ok) {
      const errors = await response.json();
      // Return errors to display in form
      // Format: { 'fieldName': 'error message' }
      throw errors;
    }
    
    return { success: true };
  } catch (error) {
    if (error['email']) {
      // Form will display these errors
      throw error;
    }
    throw error;
  }
}

function ServerValidationForm() {
  return (
    <Form 
      name="server-validation-form"
      validators={{
        email: [required(), email()],
      }}
      onSubmit={submitForm}
    >
      <Field name="email" Field={Input} label="Email" type="email" />
      <button type="submit">Register</button>
    </Form>
  );
}
```

## Cross-Field Validation

Validate based on other field values:

```jsx
import { Form, Field } from 'efx-forms';

// Validator receives all form values as second argument
const dateRange = (value, values) => {
  if (values.endDate && value > values.endDate) {
    return 'Start date must be before end date';
  }
  return false;
};

function CrossFieldForm() {
  return (
    <Form 
      name="date-range-form"
      validators={{
        startDate: [dateRange],
      }}
      onSubmit={(values) => console.log(values)}
    >
      <Field name="startDate" Field={Input} label="Start Date" type="date" />
      <Field name="endDate" Field={Input} label="End Date" type="date" />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Next Steps

- [Advanced Patterns](/docs/examples/advanced) - Conditional fields and dynamic forms

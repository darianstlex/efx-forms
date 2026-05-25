---
sidebar_position: 3
---

# Field Component

The `Field` component wraps your input components and connects them to the form state. It handles validation, error display, and value synchronization.

## Import

```tsx
import { Field } from 'efx-forms';
```

## Type Signature

```ts
interface FieldProps {
  // Required
  name: string;
  Field: ComponentType<any>;
  
  // Optional
  initialValue?: IValue;
  parse?: (value: IValue) => IValue;
  format?: (value: IValue) => IValue;
  passive?: boolean;
  validators?: TFieldValidator[];
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  disableFieldReinit?: boolean;
  formName?: string;
  
  // Passed to wrapped component
  label?: string;
  error?: string;
  errors?: string[];
  value?: IValue;
  onChange?: (value: IValue) => void;
  onBlur?: (value: IValue) => void;
  [key: string]: any;
}
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `name` | `string` | - | ✅ Yes | Field name. Used to register field in the form |
| `Field` | `ComponentType` | - | ✅ Yes | Input component to render |
| `initialValue` | `any` | `''` | No | Initial value. Used on load and reset |
| `parse` | `(value) => any` | - | No | Transform value before storing |
| `format` | `(value) => any` | - | No | Format value before displaying |
| `passive` | `boolean` | `false` | No | Passive field doesn't update active state |
| `validators` | `validator[]` | - | No | Field-level validators. Takes priority over form validators |
| `validateOnBlur` | `boolean` | `true` | No | Validate on blur. Overrides form setting |
| `validateOnChange` | `boolean` | `false` | No | Validate on change. Overrides form setting |
| `disableFieldReinit` | `boolean` | - | No | Disable reinit when `initialValue` changes |
| `formName` | `string` | - | No | Form name if used outside context or different form |

## Basic Usage

```tsx
import { Field } from 'efx-forms';

const Input = ({ label, error, value, onChange, onBlur, ...props }) => (
  <div>
    <label htmlFor={props.id}>{label}</label>
    <input
      id={props.id}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onBlur(e.target.value)}
      {...props}
    />
    {error && <span className="error">{error}</span>}
  </div>
);

function MyField() {
  return (
    <Field
      name="email"
      Field={Input}
      label="Email"
      type="email"
    />
  );
}
```

## Create Reusable Field Components

Wrap `Field` to create reusable form fields:

```tsx
import { Field } from 'efx-forms';
import { required, email } from 'efx-forms/validators';

const Input = ({ label, error, value, onChange, onBlur, ...props }) => (
  <div>
    <label>{label}</label>
    <input value={value || ''} onChange={onChange} onBlur={onBlur} {...props} />
    {error && <span>{error}</span>}
  </div>
);

// Reusable TextField
const TextField = (props) => <Field Field={Input} {...props} />;

// Usage with validators
<TextField
  name="email"
  label="Email"
  type="email"
  validators={[
    required({ msg: 'Email is required' }),
    email(),
  ]}
/>
```

## Value Transformation

### Parse (before storing)

```tsx
<Field
  name="price"
  Field={Input}
  type="number"
  parse={(value) => parseFloat(value) || 0}
/>
```

### Format (before displaying)

```tsx
<Field
  name="price"
  Field={Input}
  format={(value) => `$${Number(value).toFixed(2)}`}
/>
```

### Combined Parse and Format

```tsx
<Field
  name="date"
  Field={Input}
  parse={(value) => new Date(value).toISOString()}
  format={(value) => value ? new Date(value).toLocaleDateString() : ''}
/>
```

## Field-Level Validation

```tsx
import { required, email, min, max } from 'efx-forms/validators';

<Field
  name="email"
  Field={Input}
  label="Email"
  validators={[
    required({ msg: 'Email is required' }),
    email(),
  ]}
/>

<Field
  name="age"
  Field={Input}
  label="Age"
  type="number"
  validators={[
    min(18, { msg: 'Must be 18+' }),
    max(120, { msg: 'Invalid age' }),
  ]}
/>
```

## Validation Behavior Override

Override form-level validation settings per field:

```tsx
<Form name="my-form" validateOnBlur={false} validateOnChange={false}>
  {/* This field validates on blur despite form settings */}
  <Field
    name="email"
    Field={Input}
    validateOnBlur={true}
    validateOnChange={false}
  />
  
  {/* This field validates on change */}
  <Field
    name="password"
    Field={Input}
    validateOnBlur={false}
    validateOnChange={true}
  />
</Form>
```

## Initial Value

```tsx
<Field
  name="username"
  Field={Input}
  initialValue="John Doe"
/>
```

Note: Field `initialValue` takes priority over form `initialValues`.

## Passive Field

Passive fields don't update their active state:

```tsx
<Field
  name="readonly-field"
  Field={Input}
  passive={true}
  initialValue="Read-only value"
/>
```

## Access Field Data

### Using FieldDataProvider

```tsx
import { FieldDataProvider } from 'efx-forms/FieldDataProvider';

<Field name="username" Field={Input} />

<FieldDataProvider name="username">
  {({ value, active, error, errors }) => (
    <div>
      <p>Current value: {value}</p>
      <p>Active: {active ? 'yes' : 'no'}</p>
      {error && <p>Error: {error}</p>}
    </div>
  )}
</FieldDataProvider>
```

### Using Hooks

```tsx
import { useField, useFieldData } from 'efx-forms';

function MyComponent() {
  const field = useField('username');
  const data = useFieldData('username');
  
  return (
    <div>
      <p>Value: {data.value}</p>
      <p>Error: {data.error}</p>
    </div>
  );
}
```

## Using Outside Form Context

Specify `formName` when using field outside its form:

```tsx
// Field used outside form context
<Field
  name="username"
  Field={Input}
  formName="registration-form"
/>
```

## Complete Example

```tsx
import { Form, Field } from 'efx-forms';
import { FormDataProvider } from 'efx-forms/FormDataProvider';
import { required, email } from 'efx-forms/validators';

const Input = ({ label, error, value, onChange, onBlur, ...props }) => (
  <div className="form-field">
    <label htmlFor={props.id}>{label}</label>
    <input
      id={props.id}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onBlur(e.target.value)}
      {...props}
    />
    {error && <span className="error">{error}</span>}
  </div>
);

const TextField = (props) => <Field Field={Input} {...props} />;

function RegistrationForm() {
  const handleSubmit = async (values) => {
    console.log('Submitting:', values);
  };

  return (
    <Form
      name="registration-form"
      onSubmit={handleSubmit}
      validators={{
        name: [required()],
      }}
    >
      <TextField
        name="name"
        label="Full Name"
        validators={[required()]}
      />
      
      <TextField
        name="email"
        label="Email"
        type="email"
        validators={[
          required({ msg: 'Email is required' }),
          email(),
        ]}
      />
      
      <TextField
        name="age"
        label="Age"
        type="number"
        parse={(v) => parseInt(v, 10) || 0}
        validators={[
          required(),
          (v) => v >= 18 || 'Must be 18 or older',
        ]}
      />
      
      <FormDataProvider>
        {({ values, errors }) => (
          <pre>{JSON.stringify({ values, errors }, null, 2)}</pre>
        )}
      </FormDataProvider>
      
      <button type="submit">Register</button>
    </Form>
  );
}
```

## Related

- [Form Component](./form-component.md)
- [Utilities](./utilities.md#form-registry)
- [Validators](./utilities.md#validators)

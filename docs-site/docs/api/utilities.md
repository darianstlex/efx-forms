---
sidebar_position: 3
---

# Utilities

EFX-Forms provides utility functions for validation, data transformation, and form registry management.

## Import Paths

```ts
// Validators
import { required, email, min, max } from 'efx-forms/validators';

// Utils
import { truthyFy, shapeFy, flattenObjectKeys } from 'efx-forms/utils';

// Form Registry
import { getForm } from 'efx-forms';
```

---

## Validators

Built-in validator functions for form field validation. Each validator returns an error message string when validation fails, or `false` when validation passes.

### required

Validates that a field is not empty.

**Signature:**
```ts
required({ msg?: string } = {}) => (val: string) => string | false
```

**Parameters:**
- `msg` (optional): Custom error message. Default: `'This field is required'`

**Example:**
```ts
import { required } from 'efx-forms/validators';

// Default message
const validators = {
  name: [required()]
};

// Custom message
const validators = {
  email: [required({ msg: 'Email is required' })]
};
```

**Error Messages:**
- Default: `'This field is required'`
- Custom: Any string passed via `msg` parameter

---

### email

Validates that a value is a valid email address format.

**Signature:**
```ts
email({ msg?: string } = {}) => (val: string) => string | false
```

**Parameters:**
- `msg` (optional): Custom error message. Default: `'Must be a valid email'`

**Example:**
```ts
import { email } from 'efx-forms/validators';

const validators = {
  email: [
    required(),
    email()
  ]
};

// Custom message
const validators = {
  email: [
    email({ msg: 'Please enter a valid email address' })
  ]
};
```

**Error Messages:**
- Default: `'Must be a valid email'`
- Custom: Any string passed via `msg` parameter

---

### min

Validates that a numeric value is greater than or equal to a minimum value.

**Signature:**
```ts
min({ value: number, msg?: string } = {}) => (val: string | number) => string | false
```

**Parameters:**
- `value`: Minimum value threshold
- `msg` (optional): Custom error message. Default: `'Must be greater or equal to ${value}'`

**Example:**
```ts
import { min } from 'efx-forms/validators';

const validators = {
  age: [min({ value: 18 })],
  price: [min({ value: 0, msg: 'Price cannot be negative' })]
};
```

**Error Messages:**
- Default: `'Must be greater or equal to ${value}'` (value is interpolated)
- Custom: Any string passed via `msg` parameter

---

### max

Validates that a numeric value is less than or equal to a maximum value.

**Signature:**
```ts
max({ value: number, msg?: string } = {}) => (val: string | number) => string | false
```

**Parameters:**
- `value`: Maximum value threshold
- `msg` (optional): Custom error message. Default: `'Must be less or equal to ${value}'`

**Example:**
```ts
import { max } from 'efx-forms/validators';

const validators = {
  age: [max({ value: 120 })],
  quantity: [max({ value: 10, msg: 'Maximum quantity is 10' })]
};
```

**Error Messages:**
- Default: `'Must be less or equal to ${value}'` (value is interpolated)
- Custom: Any string passed via `msg` parameter

---

### lessThan

Validates that a string's length is less than a specified value.

**Signature:**
```ts
lessThan({ value: number, msg?: string } = {}) => (val: string) => string | false
```

**Parameters:**
- `value`: Maximum length (exclusive)
- `msg` (optional): Custom error message. Default: `'Length must be less than ${value}'`

**Example:**
```ts
import { lessThan } from 'efx-forms/validators';

const validators = {
  username: [lessThan({ value: 20 })],
  bio: [lessThan({ value: 100, msg: 'Bio must be under 100 characters' })]
};
```

**Error Messages:**
- Default: `'Length must be less than ${value}'`
- Custom: Any string passed via `msg` parameter

---

### moreThan

Validates that a string's length is greater than a specified value.

**Signature:**
```ts
moreThan({ value: number, msg?: string } = {}) => (val: string) => string | false
```

**Parameters:**
- `value`: Minimum length (exclusive)
- `msg` (optional): Custom error message. Default: `'Length must be more than ${value}'`

**Example:**
```ts
import { moreThan } from 'efx-forms/validators';

const validators = {
  password: [moreThan({ value: 8 })],
  description: [moreThan({ value: 10, msg: 'Description must be longer than 10 characters' })]
};
```

**Error Messages:**
- Default: `'Length must be more than ${value}'`
- Custom: Any string passed via `msg` parameter

---

### length

Validates that a value's length is exactly a specified number of characters.

**Signature:**
```ts
length({ value: number, msg?: string } = {}) => (val: string | number) => string | false
```

**Parameters:**
- `value`: Exact length required
- `msg` (optional): Custom error message. Default: `'Length must be exactly ${value} characters'`

**Example:**
```ts
import { length } from 'efx-forms/validators';

const validators = {
  pin: [length({ value: 4 })],
  phone: [length({ value: 10, msg: 'Phone number must be 10 digits' })]
};
```

**Error Messages:**
- Default: `'Length must be exactly ${value} characters'`
- Custom: Any string passed via `msg` parameter

---

### matches

Validates that a value matches a regular expression pattern.

**Signature:**
```ts
matches({ regexp: RegExp, label?: string, msg?: string } = {}) => (val: string) => string | false
```

**Parameters:**
- `regexp`: Regular expression to test against
- `label` (optional): Label for the pattern (used in default message)
- `msg` (optional): Custom error message. Default: `"Must match the following: '${label}'"`

**Example:**
```ts
import { matches } from 'efx-forms/validators';

const validators = {
  phone: [matches({ regexp: /^\d{10}$/, label: '10 digit phone number' })],
  code: [matches({ 
    regexp: /^[A-Z]{3}\d{3}$/, 
    msg: 'Code must be 3 letters followed by 3 digits' 
  })]
};
```

**Error Messages:**
- Default: `"Must match the following: '${label}'"`
- Custom: Any string passed via `msg` parameter

---

### positive

Validates that a value is a positive number (greater than 0).

**Signature:**
```ts
positive({ msg?: string } = {}) => (val: string | number) => string | false
```

**Parameters:**
- `msg` (optional): Custom error message. Default: `'Must be a positive number'`

**Example:**
```ts
import { positive } from 'efx-forms/validators';

const validators = {
  amount: [positive()],
  quantity: [positive({ msg: 'Quantity must be greater than zero' })]
};
```

**Error Messages:**
- Default: `'Must be a positive number'`
- Custom: Any string passed via `msg` parameter

---

### negative

Validates that a value is a negative number (less than 0).

**Signature:**
```ts
negative({ msg?: string } = {}) => (val: string | number) => string | false
```

**Parameters:**
- `msg` (optional): Custom error message. Default: `'Must be a negative number'`

**Example:**
```ts
import { negative } from 'efx-forms/validators';

const validators = {
  temperature: [negative()],
  balance: [negative({ msg: 'Balance must be below zero' })]
};
```

**Error Messages:**
- Default: `'Must be a negative number'`
- Custom: Any string passed via `msg` parameter

---

### number

Validates that a value is a valid number.

**Signature:**
```ts
number({ msg?: string } = {}) => (val: string) => string | false
```

**Parameters:**
- `msg` (optional): Custom error message. Default: `'Must be a number'`

**Example:**
```ts
import { number } from 'efx-forms/validators';

const validators = {
  age: [number()],
  price: [number({ msg: 'Please enter a valid price' })]
};
```

**Error Messages:**
- Default: `'Must be a number'`
- Custom: Any string passed via `msg` parameter

---

## Utility Functions

Helper functions for data transformation and manipulation.

### truthyFy

Returns an object containing only truthy values from the input object.

**Signature:**
```ts
truthyFy(values: Record<string, unknown>): Record<string, unknown>
```

**Parameters:**
- `values`: Object to filter

**Returns:**
- New object with only truthy values

**Example:**
```ts
import { truthyFy } from 'efx-forms/utils';

const formData = {
  name: 'John',
  email: '',
  age: 0,
  active: true,
  notes: null
};

const truthyValues = truthyFy(formData);
// Result: { name: 'John', active: true }
```

**Use Cases:**
- Filter out empty form fields before submission
- Clean up form data by removing falsy values
- Prepare data for API calls where empty values should be omitted

---

### shapeFy

Transforms a flat object with dot-notation keys into a nested object structure.

**Signature:**
```ts
shapeFy(values: Record<string, unknown>): Record<string, unknown>
```

**Parameters:**
- `values`: Flat object with dot-notation or bracket-notation keys

**Returns:**
- Nested object structure

**Example:**
```ts
import { shapeFy } from 'efx-forms/utils';

const flatData = {
  'user.name': 'John',
  'user.email': 'john@example.com',
  'address[0]': 'First Line',
  'address[1]': 'Second Line',
  'address[2]': 'Postcode'
};

const shapedData = shapeFy(flatData);
// Result:
// {
//   user: {
//     name: 'John',
//     email: 'john@example.com'
//   },
//   address: [
//     'First Line',
//     'Second Line',
//     'Postcode'
//   ]
// }
```

**Use Cases:**
- Convert flat form values to nested structures
- Prepare data for APIs expecting nested objects
- Transform form state for display or serialization

---

### flattenObjectKeys

Transforms a nested object into a flat object with one level of keys.

**Signature:**
```ts
flattenObjectKeys(obj: Record<string, any>): IRValues
```

**Parameters:**
- `obj`: Nested object to flatten

**Returns:**
- Flat object with dot-notation and bracket-notation keys

**Example:**
```ts
import { flattenObjectKeys } from 'efx-forms/utils';

const nestedData = {
  user: {
    name: 'John',
    email: 'john@example.com'
  },
  address: [
    'First Line',
    'Second Line',
    'Postcode'
  ]
};

const flatData = flattenObjectKeys(nestedData);
// Result:
// {
//   'user.name': 'John',
//   'user.email': 'john@example.com',
//   'address[0]': 'First Line',
//   'address[1]': 'Second Line',
//   'address[2]': 'Postcode'
// }
```

**Use Cases:**
- Convert initial values to flat format for form initialization
- Prepare nested data for EFX-Forms which uses flat key structure
- Transform API responses for form consumption

---

### truthyFyStore

Returns an Effector store that contains only truthy values from the source store.

**Signature:**
```ts
truthyFyStore($store: Store<Record<string, unknown>>): Store<Record<string, unknown>>
```

**Parameters:**
- `$store`: Source Effector store

**Returns:**
- New store with truthy values mapping

**Example:**
```ts
import { truthyFyStore } from 'efx-forms/utils';
import { useFormValues } from 'efx-forms/useFormValues';

const $values = useFormValues();
const $truthyValues = truthyFyStore($values);

// $truthyValues will only contain truthy values from $values
```

---

### shapeFyStore

Returns an Effector store with shaped (nested) values from the source store.

**Signature:**
```ts
shapeFyStore($store: Store<Record<string, unknown>>): Store<Record<string, unknown>>
```

**Parameters:**
- `$store`: Source Effector store with flat values

**Returns:**
- New store with shaped values mapping

**Example:**
```ts
import { shapeFyStore } from 'efx-forms/utils';
import { useFormValues } from 'efx-forms/useFormValues';

const $values = useFormValues();
const $shapedValues = shapeFyStore($values);

// $shapedValues will contain nested structure
```

---

### hasTruthy

Checks if an object has any truthy values.

**Signature:**
```ts
hasTruthy(obj: Record<string, any>): boolean
```

**Parameters:**
- `obj`: Object to check

**Returns:**
- `true` if any value is truthy, `false` otherwise

**Example:**
```ts
import { hasTruthy } from 'efx-forms/utils';

hasTruthy({ name: '', email: null, active: false }); // false
hasTruthy({ name: '', email: null, active: true });  // true
```

---

### domain

Effector domain for EFX-Forms. Useful for logging and debugging.

**Signature:**
```ts
domain: Domain
```

**Example:**
```ts
import { domain } from 'efx-forms/utils';

// Use for debugging or logging effector events
domain.onCreateEvent((event) => {
  console.log('Event created:', event);
});
```

---

## Form Registry

### getForm

Retrieves or creates a form instance by name from the global registry.

**Signature:**
```ts
getForm(config: IFormConfig): FormInstance
```

**Parameters:**
- `config`: Form configuration object
  - `name` (required): Unique form identifier
  - Other form configuration options (initialValues, validators, etc.)

**Returns:**
- `FormInstance`: The form instance with all stores, events, and methods

**Example:**
```ts
import { getForm } from 'efx-forms';

// Get or create form instance
const form = getForm({ 
  name: 'user-form',
  initialValues: {
    'user.name': '',
    'user.email': ''
  }
});

// Access form stores
const values = form.$values;
const errors = form.$errors;

// Use form methods
form.reset();
form.submit();
```

**Behavior:**
- If form with given name exists, returns existing instance
- If form doesn't exist, creates new instance with provided config
- Additional config passed on subsequent calls updates the form configuration

**Use Cases:**
- Access form instance outside of React context
- Use form methods in non-component code
- Share form instance across multiple components
- Programmatic form control

---

## Complete Example

```tsx
import { Form, Field } from 'efx-forms';
import { getForm } from 'efx-forms';
import { required, email, min, max } from 'efx-forms/validators';
import { truthyFy, shapeFy, flattenObjectKeys } from 'efx-forms/utils';

// Define validators
const validators = {
  'user.name': [required({ msg: 'Name is required' })],
  'user.email': [
    required({ msg: 'Email is required' }),
    email()
  ],
  'user.age': [
    min({ value: 18, msg: 'Must be at least 18' }),
    max({ value: 120 })
  ]
};

// Component usage
const MyForm = () => {
  const handleSubmit = (values) => {
    // Filter out empty values
    const cleanValues = truthyFy(values);
    
    // Transform to nested structure
    const nestedValues = shapeFy(cleanValues);
    
    console.log(nestedValues);
  };

  return (
    <Form name="registration" onSubmit={handleSubmit} validators={validators}>
      <Field name="user.name" label="Name" Field={Input} />
      <Field name="user.email" label="Email" Field={Input} />
      <Field name="user.age" label="Age" Field={Input} />
      <button type="submit">Submit</button>
    </Form>
  );
};

// Access form outside component
const form = getForm({ name: 'registration' });

// Flatten nested initial values
const initialValues = flattenObjectKeys({
  user: {
    name: '',
    email: '',
    age: 18
  }
});
```

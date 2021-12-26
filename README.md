# EFX-Forms

> Effector JS forms

## Installation
```bash
$ npm install efx-forms
```
Peer dependencies - library depends on:
> react effector effector-react lodash-es
## Main Components

### REfxForm / REfxField
```jsx
import { REfxForm, REfxField } from 'efx-forms/react';
import { required } from 'efx-forms/validators';

const Input = ({ label, error, errors, ...props }) => (
  <div>
    <span>{label}</span>
    <input {...props} />
    <span>{error}</span>
  </div>
)

const Page = () => {
  const submit = (values) => {
    console.log(values);
  }
  return (
    <REfxForm name="user" onSubmit={submit}>
      <REfxField
        name="name"
        Field={Input}
        label="Name"
        type="text"
        validators={[required()]}
      />
      <button type="submit">Submit</button>
    </REfxForm>
  )
}
```

# Props
### REfxForm
Form component
```ts
interface REfxForm {
  // Form name
  name: string,
  /**
   * Form submit method - on validation success
   * will be called with form values.
   * If skipClientValidation is set - no validation will be applied.
   * If remoteValidation is set - submit function should return promise:
   * - reject - object with errors per field - errors will be passed to the form
   *   { 'user.name': 'Name is already taken', ... }
   * - resolve - success submit
   * @param values - FormValues - flat
   * @example
   * { 'user.name': 'John', 'user.age': '20' }
   */
  onSubmit?: (values) => void;
  // If set, submit function will be called to get API validation errors
  remoteValidation?: boolean;
  // If set, submit will skip client form validation
  skipClientValidation?: boolean;
  // Form initial values - field initialValue is in priority
  initialValues?: { 'fieldName': 'value' }
  // Set form validation behavior onBlur - field validateOnBlur is in priority
  validateOnBlur?: boolean;
  // Set form validation behavior onChange - field validateOnChange is in priority
  validateOnChange?: boolean;
  // Validation config per field - field validators is in priority
  validations?: { 'fieldName': [() => string | false] },
}
```

### REfxField
Field component
```ts
interface REfxField {
  // Field name
  name: string,
  // Field initial value - used on initial load and reset
  initialValue?: string | number | null | boolean | [];
  // Transform value before set to store
  parse?: (value: any) => string | number | null | boolean | [];
  // Format value before displaying
  format?: (value) => any;
  // Validators array - applied on validation
  validators?: [() => string | false]
  // Set validation behaviour onBlur, overrides form value
  validateOnBlur?: boolean;
  // Set validation behaviour onChange, overrides form value
  validateOnChange?: boolean;
  // Field component - component to be used as form field
  Field: ReactComponent;
  // Form name - if field belongs to a different form or used outside of the form
  formName?: string;
}
```

### REfxWhen
Conditional rendering helper component
```ts
interface REfxWhen {
  // Form name - used to get form values
  form?: string;
  // Conition check - accepts form values and return boolean,
  // if true render children
  check: (values: FormValues) => boolean;
  // Set fields values on show - { 'fieldName': 'value' }
  setTo?: FormValues;
  // Set fields values on hide - { 'fieldName': 'value' }
  resetTo?: FormValues;
  // Debounce for fields update
  updateDebounce?: number;
}
```
[Examples](https://github.com/darianstlex/efx-forms-cra)

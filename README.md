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
   * Form submit method - on validation success will be called with form values.
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
  // Keep form data on unmount
  keepFormOnUnmount: boolean;
  // Set fields validation behavior onBlur - field validateOnBlur is in priority
  validateOnBlur?: boolean;
  // Set fields validation behavior onChange - field validateOnChange is in priority
  validateOnChange?: boolean;
  // Validation config per field - field validators is in priority
  validations?: { 'fieldName': [(value) => string | false] };
}
```

### REfxField
Field component
```ts
interface REfxField {
  // Field name
  name: string,
  // Field initial value - used on initial load and reset
  // default = ''
  initialValue?: string | number | null | boolean | [] | {};
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

# Instances
Form Instance
```ts
interface FormInstance {
  // Form name
  name: string;
  // Form active fields - all fields statuses - flat
  // Indicates if field is mounted / unmounted
  $active: Store<{ [name: string]: boolean }>;
  // Form active values - all active / visible fields values - flat
  $actives: Store<{ [name: string]: FieldValue }>;
  // Form values onChange - emits form values only on field change event - flat
  $changes: Store<{ [name: string]: FieldValue }>;
  // Form values - emits any form values changes - flat
  $values: Store<{ [name: string]: FieldValue }>;
  // Form errors - all fields errors - flat
  $errors: Store<{ [name: string]: string }>
  // Form validity - true if form is valid
  $valid: Store<boolean>;
  // Form submitting - true if busy
  $submitting: Store<boolean>;
  // Form touched - true if form is touched
  $touched: Store<boolean>;
  // Form touches - all fields touches - flat
  $touches: Store<{ [name: string]: boolean }>;
  // Form dirty - true if different from initial values
  $dirty: Store<boolean>;
  // Form dirties - all fields dirty state - flat
  $dirties: Store<{ [name: string]: boolean }>;
  // Form reset - resets form and all fields
  reset: Event<void>;
  // Form submit - callback will be called with form values if form is valid - sync
  submit: (args: { cb, skipClientValidation }) => void;
  // Form submit - callback will be called with form values to get remote validation
  // Will return promise reject with errors or resolve
  submitRemote: ({ cb, skipClientValidation }) => { [name]: string } | undefined;
  // Form config - getter / setter
  config: {
    initialValues?: {},
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    formValidations?: {};
  };
  // Form fields getter
  fields: Fields[];
  // Return given field by name
  getField: (name: string) => Field;
  // Register new field -  internal usage
  registerField: (config) => Field;
  // Removes field by name
  removeField: (name: string) => void;
  // Form bulk update field values
  update: (values: FormValues) => void;
}
```

Field Instance
```ts
interface FieldInstance {
  // Field name
  name: string;
  // Field active / mounted
  active: boolean;
  // Field active / mounted - store
  $active: Store<boolean>;
  // Field value - store
  $value: Store<FieldValue>;
  // Field touched - store
  $touched: Store<boolean>;
  // Field dirty store
  $dirty: Store<boolean>;
  // Field error messages - store
  $errors: Store<string[]>;
  // Field onChange event
  onChange: Event<any>;
  // Field onBlur event
  onBlur: Event<void>;
  // Field update - updates field value without triggering form change event
  update: Event<FieldValue>;
  // Field reset - if field is touched or not valid
  reset: Event<void>;
  // Field validate - runs field validation
  validate: Event<void>;
  // Field setActive - set field active / mounted
  setActive: Event<boolean>;
  // Field setError - set provided error
  setError: Event<string>;
  // Field reset errors
  resetError: Event<void>;
  // internal use
  syncData: () => void;
  // Field config - get/set field config
  config: {
    name: string;
    initialValue: FieldValue;
    parse: (value: FieldValue) => FieldValue,
    format: (value: FieldValue) => FieldValue,
    validators: FieldValidator[],
    validateOnBlur: boolean;
    validateOnChange: boolean;
  };
}
```

# Methods / Hooks
```ts
import { getForm } from 'efx-forms';
import {
  useForm,
  useFormValues,
  useField,
  useFieldValue,
} from 'efx-forms/react';

/**
 * Return form by name
 * @type (name: string) => FormInstance
 */
const formOne = getForm('form-one');

/**
 * Hook - return form instance by name, if not provided takes it from context
 * @type (name?: string) => FormInstance
 */
const formTwo = useForm('form-two');

/**
 * Hook - return form values by name, if not provided takes it from context
 * @type (name?: string) => FormValues
 */
const formValues = useFormValues('form-two');

/**
 * Hook - return field by name, if form name is not provided takes it from context
 * @type (name: string, form?: string) => Field
 */
const field = useField('field-one', 'form-one');

/**
 * Hook - return field value by name, if form name is not provided takes it from context
 * @type (name: string, form?: string) => Field
 */
const fieldValue = useFieldValue('field-one', 'form-one');
```

# Utils
```ts
import {
  // effector forms domain, usefull for logging / debugging
  domain,
  truthyFy,
  shapeFy,
  truthyFyStore,
  shapeFyStore,
} from 'efx-forms/utils';

/**
 * Return only truthy values from object
 * @type (values: FormValues) => FormValues
 */
const truthyValues = truthyFy(values);

/**
 * Return flat to shaped values
 * @type (values: FormValues) => {}
 * @example
 * { 'user.name': 'John' } => { user: { name: 'John } }
 */
const shapedValues = shapeFy(values);

/**
 * Return effector store with truthy values
 * @type ($values: Store): Store => $truthyValues
 */
const truthyStore = truthyFyStore($values);

/**
 * Return effector store with shaped values
 * @type ($values: Store): Store => $shapedValues
 */
const shapedStore = shapeFyStore($values);
```

# Validators
Check validators.ts file to see all built-in validators and their arguments
```ts
import { required } from 'efx-forms/validators';
```

[Examples](https://github.com/darianstlex/efx-forms-cra)

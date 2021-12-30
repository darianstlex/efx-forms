# EFX-Forms

> Effector JS forms

## Installation
```bash
$ npm install efx-forms
```
Peer dependencies - library depends on:
> react effector effector-react lodash
## Main Components

### Form / Field
```jsx
import { Form, Field } from 'efx-forms/react';
import { required, email } from 'efx-forms/validators';

const Input = ({ id, label, error, errors, ...props }) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <input id={id} {...props} />
    <span>{error}</span>
  </div>
)

const validations = {
  name: [required()],
}

const Page = ({ name }) => {
  const submit = (values) => {
    console.log(values);
  }
  return (
    <Form name="user" onSubmit={submit} validations={validations}>
      <Field
        name="name"
        Field={Input}
        label="Name"
        type="text"
      />
      <Field
        name="email"
        Field={Input}
        label="Email"
        type="email"
        validators={[required({ msg: `Hey ${name} email is required` }), email()]}
      />
      <button type="submit">Submit</button>
    </Form>
  )
}
```

# Props
### Form component
```ts
interface Form {
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
  onSubmit?: (values: IFormValues) => void;
  // If set, submit function will be called to get API validation errors
  // Default: false
  remoteValidation?: boolean;
  // If set, submit will skip client form validation
  // Default: false
  skipClientValidation?: boolean;
  // Form initial values - field initialValue is in priority
  initialValues?: { fieldName: 'value' }
  // Keep form data on unmount
  // Default: false
  keepFormOnUnmount: boolean;
  // Set fields validation behavior onBlur - field validateOnBlur is in priority
  // Default: true
  validateOnBlur?: boolean;
  // Set fields validation behavior onChange - field validateOnChange is in priority
  // if set, validateOnBlur doesn't work
  // Default: false
  validateOnChange?: boolean;
  // Validation config per field - field validators is in priority
  validations?: { fieldName: [(value: TFieldValue) => string | false] };
}
```

### Field component
```ts
interface Field {
  // Field name
  name: string,
  // Field initial value - used on initial load and reset
  // default = ''
  initialValue?: TFieldValue;
  // Transform value before set to store
  parse?: (value: any) => TFieldValue;
  // Format value before displaying
  format?: (value: TFieldValue) => any;
  // Validators array - applied on validation
  validators?: [(value: TFieldValue) => string | false]
  // Set validation behaviour onBlur, overrides form value
  // Default: true
  validateOnBlur?: boolean;
  // Set validation behaviour onChange, overrides form value
  // if set, validateOnBlur doesn't work
  // Default: false
  validateOnChange?: boolean;
  // Field component - component to be used as form field
  Field: ReactComponent;
  // Form name - if field belongs to a different form or used outside of the form
  formName?: string;
}
```

### DisplayWhen component
Conditional rendering helper component
```ts
interface DisplayWhen {
  // Form name - used to get form values
  // if not provided will be taken from context
  form?: string;
  // Conition check - accepts form values and return boolean,
  // if true render children
  check: (values: IFormValues) => boolean;
  // Set fields values on show - { fieldName: 'value' }
  setTo?: IFormValues;
  // Set fields values on hide - { fieldName: 'value' }
  resetTo?: IFormValues;
  // Debounce for fields update
  // Default: 0
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
  $actives: Store<{ [name: string]: TFieldValue }>;
  // Form values onChange - emits form values only on field change event - flat
  $changes: Store<{ [name: string]: TFieldValue }>;
  // Form values - emits any form values changes - flat
  $values: Store<{ [name: string]: TFieldValue }>;
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
  submitRemote: ({cb, skipClientValidation}) => { [name]: string } | undefined;
  // Form config - getter / setter
  config: {
    initialValues?: {},
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    formValidations?: {};
  };
  // Form fields getter
  fields: { [name: string]: IField };
  // Return given field by name
  getField: (name: string) => IField;
  // Register new field -  internal usage
  registerField: (config) => IField;
  // Form bulk update field values
  update: (values: IFormValues) => void;
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
  update: Event<TFieldValue>;
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
    initialValue: TFieldValue;
    parse: (value: any) => TFieldValue,
    format: (value: TFieldValue) => any,
    validators: TFieldValidator[],
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
  useFormStoreValue,
  useField,
  useFieldValue,
  useFieldStoreValue,
} from 'efx-forms/react';

/**
 * Return form by name
 * @type (name: string) => IForm
 */
const formOne = getForm('form-one');

/**
 * Hook - return form (from context) instance or provided form by name
 * form name is needed when hook is used outside of the form context
 * or refers to another form
 * @type (formName?: string) => IForm
 */
const formTwo = useForm();

/**
 * Hook - return form (from context) store values or from provided form
 * form name is needed when hook is used outside of the form context
 * or refers to another form
 * @type (store: string, formName?: string) => IFormErrors
 */
const formErrors = useFormStoreValue('$errors');

/**
 * Hook - return form (from context) values or from provided form
 * form name is needed when hook is used outside of the form context
 * or refers to another form
 * @type (formName?: string) => IFormValues
 */
const formValues = useFormValues();

/**
 * Hook - return field by name, if form name is not provided takes it from context
 * form name is needed when hook is used outside of the form context
 * or refers to another form
 * @type (name: string, formName?: string) => IField
 */
const field = useField('field-one');

/**
 * Hook - return field value by name, if form name is not provided takes it from context
 * form name is needed when hook is used outside of form context
 * or refers to another form
 * @type (name: string, formName?: string) => IField
 */
const fieldValue = useFieldValue('field-one', 'form-one');

/**
 * Hook - return field store values from form in context or from provided form
 * form name is needed when hook is used outside of form context
 * or refers to another form
 * @type (name: string, store: string, formName?: string) => IFormErrors
 */
const fieldErrors = useFieldStoreValue('field-one', '$errors');
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
 * @type (values: IFormValues) => IFormValues
 */
const truthyValues = truthyFy(values);

/**
 * Return flat to shaped values
 * @type (values: IFormValues) => {}
 * @example
 * { 'user.name': 'John' } => { user: { name: 'John } }
 */
const shapedValues = shapeFy(values);

/**
 * Return effector store with truthy values
 * @type ($values: Store): Store => $truthyValues
 */
const $truthyStore = truthyFyStore($values);

/**
 * Return effector store with shaped values
 * @type ($values: Store): Store => $shapedValues
 */
const $shapedStore = shapeFyStore($values);
```

# Validators
Check validators.d.ts file to see all built-in validators and their arguments
```ts
import { required } from 'efx-forms/validators';

const formValidations = {
  'user.name': [required()],
  'user.email': [required({ msg: 'Email is required' })], // custom message
}
```

[Examples](https://github.com/darianstlex/efx-forms-cra)

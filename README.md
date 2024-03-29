# EFX-Forms

> Effector JS forms

## Installation
```bash
$ npm install efx-forms
```
Peer dependencies - library depends on:
> react effector effector-react lodash

## NextJS
```jsx
import { Form, Field } from 'efx-forms/mjs/react';
import { required, email } from 'efx-forms/mjs/validators';
```

## Main Components

### Form / Field
```jsx
import { Form, Field, FormDataProvider } from 'efx-forms/react';
import { required, email } from 'efx-forms/validators';

const Input = ({ id, label, error, errors, ...props }) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <input id={id} {...props} />
    <span>{error}</span>
  </div>
)

const validators = {
  name: [required()],
}

const Page = ({ name }) => {
  const submit = (values) => {
    console.log(values);
  }
  return (
    <Form name="user" onSubmit={submit} validators={validators}>
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
        validators={[
          required({ msg: `Hey ${name} email is required` }),
          email(),
        ]}
      />
      <FormDataProvider stores={['$values', '$errors']}>
        {([values, errors]) =>(
          <div>
            <pre>JSON.stringify(values)</pre>
            <pre>JSON.stringify(errors)</pre>
          </div>
        )}
      </FormDataProvider>
      <button type="submit">Submit</button>
    </Form>
  )
}
```

# Props
### Form component
```ts
interface Form {
  // Form name - required, used to get form instance outside of context
  name: string,
  /**
   * Form submit method - on validation success will be called with
   * form values.
   * If skipClientValidation is set - no validation will be applied.
   * If submit return promise:
   * - reject - object with errors per field - errors will be passed
   *   to the form
   *   { 'user.name': 'Name is already taken', ... }
   * - resolve - success submit
   * @param values - FormValues - flat
   * @example
   * { 'user.name': 'John', 'user.age': '20' }
   */
  onSubmit?: (values: IFormValues) => void | Promise<IFormErrors>;
  // If set, submit will skip client form validation
  // Default: false
  skipClientValidation?: boolean;
  // Form initial values - field initialValue is in priority
  initialValues?: { fieldName: 'value' }
  // Keep form data on unmount
  // Default: false
  keepOnUnmount: boolean;
  // Set fields validation behavior onBlur
  // field validateOnBlur is in priority
  // Default: true
  validateOnBlur?: boolean;
  // Set fields validation behavior onChange
  // field validateOnChange is in priority
  // if set, validateOnBlur doesn't work
  // Default: false
  validateOnChange?: boolean;
  // Validators config per field - field validators is in priority
  validators?: {
    fieldName: [
      (value: TFieldValue, values: IFormValues) => string | false,
    ]
  };
}
```

### Field component
```ts
interface Field {
  // Field name - required, used to register/get field in the form
  name: string,
  // Field initial value - used on initial load and reset
  // default = ''
  initialValue?: TFieldValue;
  // Transform value before set to store
  parse?: (value: any) => TFieldValue;
  // Format value before displaying
  format?: (value: TFieldValue) => any;
  // Validators array - applied on validation
  validators?: [
    (value: TFieldValue, values: IFormValues) => string | false,
  ];
  // Set validation behaviour onBlur, overrides form value
  // Default: true
  validateOnBlur?: boolean;
  // Set validation behaviour onChange, overrides form value
  // if set, validateOnBlur doesn't work
  // Default: false
  validateOnChange?: boolean;
  // Field component - component to be used as form field
  Field: ReactComponent;
  // Form name - if field belongs to a different form or used outside
  // of the form context
  formName?: string;
}
```

### IfFormValues component
Conditional rendering based on form values
```ts
interface IfFormValues {
  children: ReactNode;
  // Form name - used to get form values,
  // if not provided will be taken from context
  form?: string;
  // Condition check - accepts form values and return boolean,
  // if true render children
  check: (values: IFormValues, activeValues: IFormValues) => boolean;
  // Set fields values on show - { fieldName: 'value' }
  setTo?: IFormValues;
  // Set fields values on hide - { fieldName: 'value' }
  resetTo?: IFormValues;
  // Debounce for fields update
  // Default: 0
  updateDebounce?: number;
}
```
```jsx
import { IfFormValues } from 'efx-forms/react';

const ConditionalRender = () => (
  <IfFormValues check={({ age }) => age > 21 }>
    <div>I am a big boy!</div>
  </IfFormValues>
);

const ConditionalRenderProp = () => (
  <IfFormValues
    check={({ age }) => age > 21 }
    render={({ age, name }) => <div>My name is {name}, I am {age}</div>}
  />
);
```

### IfFieldsValue component
Conditional rendering based on fields value
```ts
interface IfFieldsValue {
  children: ReactNode;
  // Fields name array to check against
  fields: string[];
  // Form name - if fields belongs to a different form or used outside
  // of the form context
  formName?: string;
  // Condition check - accepts stores array and return boolean,
  // if true render children
  check: (values: any[]) => boolean;
}
```
```jsx
import { IfFieldsValue } from 'efx-forms/react';

const ConditionalRender = () => (
  <IfFieldsValue
    fields={['height', 'age']}
    check={([height, age]) => height > 190 && age > 21}
  >
    <div>I am a big and tall boy!</div>
  </IfFieldsValue>
);

const ConditionalRenderProp = () => (
  <IfFieldsValue
    fields={['height', 'age']}
    check={([height, age]) => height > 190 && age > 21 }
    render={([height, age]) => <div>Height: {height}, Age: {age}</div>}
  />
);
```

### FormDataProvider component
Subscribe for form values changes
```ts
interface FormDataProvider {
  // Render function - provides all subscribed data
  children: (values: any[]) => ReactNode;
  // Form name if used outside of context or refers to another form
  name?: string;
  // Form stores array to get values from
  stores: TFormStoreKey[];
}
```
```jsx
import { FormDataProvider } from 'efx-forms/react';

const FormData = () => (
  <FormDataProvider stores={['$values', '$errors']}>
    {([values, errors]) => <div>{values} - {errors}</div>}
  </FormDataProvider>
);
```

### FieldDataProvider component
Subscribe for field value changes
```ts
interface FieldDataProvider {
  // Render function - provides all subscribed data
  children: (values: any[]) => ReactNode;
  // Field name to get stores values from
  name: string;
  // Form name if used outside of context or refers to another form
  formName?: string;
  // Form stores array to get values from
  stores: TFieldStoreKey[];
}
```
```jsx
import { FieldDataProvider } from 'efx-forms/react';

const FieldData = () => (
  <FieldDataProvider name="user.name" stores={['$value', '$active']}>
    {([value, mounted]) => <div>{value} - {mounted}</div>}
  </FieldDataProvider>
);
```

### FieldsValueProvider component
Subscribe for fields value changes
```ts
interface FieldsValueProvider {
  // Render function - args are subscribed stores values in array
  children: (values: any[]) => ReactNode;
  // Form name to get fields from
  formName?: string;
  // Fields array - string - ['user.name', 'user.age']
  fields: string[];
}
```
```jsx
import { FieldsValueProvider } from 'efx-forms/react';

const FieldsData = () => (
  <FieldsValueProvider fields={['user.name', 'user.age']}>
    {([name, age]) => <div>{name} - {age}</div>}
  </FieldsValueProvider>
);
```

# Instances
Form Instance
```ts
interface FormInstance {
  // Form name
  name: string;
  // Form active fields - all fields statuses
  // Indicates if field is mounted / unmounted
  $active: Store<{ [name: string]: boolean }>;
  // Form active values - all active / visible fields values
  $actives: Store<{ [name: string]: TFieldValue }>;
  // Form values onChange - emits form values only on field change event
  $changes: Store<{ [name: string]: TFieldValue }>;
  // Form values - emits any form values changes
  $values: Store<{ [name: string]: TFieldValue }>;
  // Form errors - all fields errors
  $errors: Store<{ [name: string]: string }>
  // Form validity - true if form is valid
  $valid: Store<boolean>;
  // Form submitting - true if busy
  $submitting: Store<boolean>;
  // Form touched - true if form is touched
  $touched: Store<boolean>;
  // Form touches - all fields touches
  $touches: Store<{ [name: string]: boolean }>;
  // Form dirty - true if different from initial values
  $dirty: Store<boolean>;
  // Form dirties - all fields dirty state
  $dirties: Store<{ [name: string]: boolean }>;
  // Form reset - resets form and all fields
  reset: Event<void>;
  // Form submit - callback will be called with form values if form
  // is valid, if callback returns promise reject with errors, will
  // highlight them in the form.
  submit: (args: { cb, skipClientValidation }) => Promise<IFormErrors>;
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
  // Register new field - internal usage
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
  // Field update - updates field value without triggering
  // form change event, but will trigger validation
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
  useFormStore,
  useFormStores,
  useField,
  useFieldValue,
  useFieldsValue,
  useFieldStore,
  useFieldStores,
} from 'efx-forms/react';

/**
 * For all Field hooks, before usage make sure field is registered
 * in the form or will be register on the next render cycle. Otherwise
 * it will return empty non reactive store.
 */

/**
 * Return form by name
 * @type (name: string) => IForm
 */
const formOne = getForm('form-one');

/**
 * Hook - return form (from context) instance or provided form by name.
 * Form name is needed when hook is used outside of the form context
 * or refers to another form.
 * @type (formName?: string) => IForm
 */
const formTwo = useForm();

/**
 * Hook - return form (from context) store values or from provided form.
 * Form name is needed when hook is used outside of the form context
 * or refers to another form.
 * @type (store: string, formName?: string) => IFormErrors
 */
const formErrors = useFormStore('$errors');

/**
 * Hook - return form (from context) stores values array or from
 * provided form. Form name is needed when hook is used outside of the
 * form context or refers to another form.
 * @type (store: string[], formName?: string) => IFormErrors
 */
const [errors, values] = useFormStores(['$errors', '$values']);

/**
 * Hook - return form (from context) values or from provided form.
 * Form name is needed when hook is used outside of the form context
 * or refers to another form.
 * @type (formName?: string) => IFormValues
 */
const formValues = useFormValues();

/**
 * Hook - return field by name
 * Form name is needed when hook is used outside of the form context
 * or refers to another form.
 * @type (name: string, formName?: string) => IField
 */
const field = useField('field-one');

/**
 * Hook - return field value by name
 * Form name is needed when hook is used outside of form context
 * or refers to another form.
 * @type (name: string, formName?: string) => IField
 */
const fieldValue = useFieldValue('field-one');

/**
 * Hook - return fields values by names
 * Form name is needed when hook is used outside of form context
 * or refers to another form.
 * @type (fields: string[], formName?: string) => IField
 */
const [fieldOne, fieldTwo] = useFieldsValue(['field-one', 'field-two']);

/**
 * Hook - return field store values
 * Form name is needed when hook is used outside of form context
 * or refers to another form
 * @type (name: string, store: string, formName?: string) => IFormErrors
 */
const fieldErrors = useFieldStore('field-one', '$errors');

/**
 * Hook - return field stores value array
 * Form name is needed when hook is used outside of form context
 * or refers to another form
 * @type (name: string, store: string[], formName?: string) => IFormErrors
 */
const [value, touched] = useFieldStores(
  'field-one',
  ['$value', '$touched'],
);
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
import { required, email } from 'efx-forms/validators';

const formValidations = {
  'user.name': [required()],
  'user.email': [
    required({ msg: 'Email is required' }), // custom message
    email(),
  ],
}
```

[Examples](https://github.com/darianstlex/efx-forms-cra)

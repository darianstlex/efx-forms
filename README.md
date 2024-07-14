# EFX-Forms

> Effector JS forms

There are some breaking changes starting from v2

## Installation
```bash
$ npm install efx-forms
```
Peer dependencies - library depends on:
> react effector effector-react lodash

## NextJS
mjs build included

## Main Components

### Form / Field
```jsx
import { Form, Field } from 'efx-forms';
import { FormDataProvider } from 'efx-forms/FormDataProvider';
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
    <Form name="user-form" onSubmit={submit} validators={validators}>
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
      <FormDataProvider>
        {({ values, errors }) =>(
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
  // Default: true
  validateOnBlur?: boolean;
  // Set fields validation behavior onChange
  // Default: false
  validateOnChange?: boolean;
  // Validators config per field - field validators are in priority
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
  children?: ReactNode;
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
  // Render prop - accepts form values and return react element
  // if defined will be used instead of children
  render?: (values: IFormValues) => ReactElement;
}
```

```jsx
import { IfFormValues } from 'efx-forms/IfFormValues';

const ConditionalRender = () => (
  <IfFormValues check={({ age }) => age > 21 }>
    <div>Hey, I am here</div>
  </IfFormValues>
);

const ConditionalRenderProp = () => (
  <IfFormValues
    check={({ age }) => age > 21 }
    render={({ age, name }) => <div>Hi, I am {name} - {age}</div>}
  />
);
```

### FormDataProvider component
Subscribe for form values changes
```ts
interface FormDataProvider {
  // Render function - provides all subscribed data
  children: (values: ReturnType<typeof useForm>) => ReactNode;
  // Form name if used outside of context or refers to another form
  name?: string;
}
```
```jsx
import { FormDataProvider } from 'efx-forms/FormDataProvider';

const FormData = () => (
  <FormDataProvider>
    {({ values, errors }) => <div>{values} - {errors}</div>}
  </FormDataProvider>
);
```

### FieldDataProvider component
Subscribe for field value changes

```ts
interface FieldDataProvider {
  // Render function - provides all subscribed data
  children: (values: ReturnType<typeof useFieldData>) => ReactNode;
  // Field name to get stores values from
  name: string;
  // Form name if used outside of context or refers to another form
  formName?: string;
}
```
```jsx
import { FieldDataProvider } from 'efx-forms/FieldDataProvider';

const FieldData = () => (
  <FieldDataProvider name="user.name">
    {({ value, active }) => <div>{value} - {active}</div>}
  </FieldDataProvider>
);
```

# Instances
Form Instance
```ts
interface FormInstance {
  /** PROPERTY - Form name */
  domain: Domain;
  /** PROPERTY - Form name */
  name: string;
  /** $$STORE - Form active fields - all fields statuses - flat */
  $active: Store<Record<string, boolean>>;
  /** $$STORE - Form active values - all active / visible fields values - flat */
  $activeValues: Store<Record<string, any>>;
  /** $$STORE - Form values - all fields values - flat */
  $values: Store<Record<string, any>>;
  /** $$STORE - Form errors - all field errors */
  $errors: Store<Record<string, string[]>>;
  /** $$STORE - Form errors - fields last error - flat */
  $error: Store<Record<string, string | null>>;
  /** $$STORE - Form valid - true if form is valid */
  $valid: Store<boolean>;
  /** $$STORE - Form submitting - true if busy */
  $submitting: Store<boolean>;
  /** $$STORE - Form touched - true if touched */
  $touched: Store<boolean>;
  /** $$STORE - Form touches - all fields touches - flat */
  $touches: Store<Record<string, boolean>>;
  /** $$STORE - Form dirty - true if diff from initial value */
  $dirty: Store<boolean>;
  /** $$STORE - Form dirties - all fields dirty state - flat */
  $dirties: Store<Record<string, boolean>>;
  /** EVENT - Form reset - resets form to initial values */
  reset: EventCallable<string | void>;
  /** EVENT - Form erase - reset form and delete all assigned form data */
  erase: EventCallable<void>;
  /** EVENT - Set form config */
  setActive: EventCallable<INameBoolean>;
  /**
   * EFFECT - Form submit - callback will be called with form values if form is valid
   * or if callback returns promise reject with errors, will highlight them in the form
   */
  submit: Effect<ISubmitArgs, ISubmitResponseSuccess, ISubmitResponseError>;
  /** EVENT - Form update fields values */
  setValues: EventCallable<Record<string, any>>;
  /** EVENT - Form onChange event */
  onChange: EventCallable<INameValue>;
  /** EVENT - Form onBlur event */
  onBlur: EventCallable<INameValue>;
  /** EVENT - Form validate trigger */
  validate: EventCallable<IValidationParams>;
  /** PROP - Form config */
  config: IFormConfig;
  /** METHOD - Set form config */
  setConfig: (cfg: IFormConfig) => void;
  /** PROP - Form config */
  configs: Record<string, IFieldConfig>;
  /** METHOD - Set field config */
  setFieldConfig: (cfg: IFieldConfig) => void;
}
```

# Methods / Hooks
```ts
import { getForm, useFormInstance } from 'efx-forms';
import { useForm } from 'efx-forms/useForm';
import { useFormValues } from 'efx-forms/useFormValues';
import { useFormStore } from 'efx-forms/useFormStore';
import { useFormStores } from 'efx-forms/useFormStores';
import { useField } from 'efx-forms/useField';
import { useFieldData } from 'efx-forms/useFieldData';

/**
 * For all Field hooks, before usage make sure field is registered
 * in the form or will be register on the next render cycle. Otherwise
 * it will return empty non reactive store.
 */

/**
 * Return form by name
 * @type (config: IFormConfig) => IForm
 */
const formOne = getForm({ name: 'form-one' });

/**
 * Hook - return form (from context) data or provided form by name.
 * Form name is needed when hook is used outside of the form context
 * or refers to another form.
 * Result includes all form data in plain objects and units in scope
 * @type (formName?: string) => ReturnType<typeof useForm>
 */
const formTwo = useForm();

/**
 * Hook - return form (from context) instance or provided form by name.
 * Form name is needed when hook is used outside of the form context
 * or refers to another form.
 * Result contains all form stores and units, use useUnit to get values
 * @type (formName?: string) => ReturnType<typeof useFormInstance>
 */
const formInst = useFormInstance();

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
 * @type (name: string, formName?: string) => ReturnType<typeof useField>
 */
const field = useField('field-one');

/**
 * Hook - return field value by name
 * Form name is needed when hook is used outside of form context
 * or refers to another form.
 * @type (name: string, formName?: string) => ReturnType<typeof useFieldData>
 */
const fieldData = useFieldData('field-one');
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

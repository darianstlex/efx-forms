# useForm

Get form data and methods combined. Returns form state as plain objects and methods as effector events.

## Import

```ts
import { useForm } from 'efx-forms/useForm';
```

## Signature

```ts
function useForm(formName?: string): {
  // State (plain objects)
  active: IRBoolean;
  activeValues: IRValues;
  dirties: IRBoolean;
  dirty: boolean;
  error: IRError;
  errors: IRErrors;
  submitting: boolean;
  touched: boolean;
  touches: IRBoolean;
  valid: boolean;
  values: IRValues;
  
  // Methods (effector events)
  change: EventCallable<IValuePayload>;
  erase: EventCallable<void>;
  reset: EventCallable<void>;
  setActive: EventCallable<IBooleanPayload>;
  setValues: EventCallable<IRValues>;
  setErrors: EventCallable<IRErrors>;
  replaceErrors: EventCallable<IRErrors>;
  submit: Effect<ISubmitArgs, ISubmitResponseSuccess, ISubmitResponseError>;
  validate: EventCallable<IValidationParams>;
  
  // Config methods (synchronous)
  setConfig: (cfg: IFormConfig) => void;
  setFieldConfig: (cfg: IFieldConfig) => void;
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `formName` | `string` | No | Form name. Auto-detected from context if not provided. Required when used outside `<Form>` context or targeting a different form. |

## Return Type

Object containing:
- **State properties**: Plain objects with current form state (values, errors, dirty, touched, etc.)
- **Methods**: Effector events for form operations (change, reset, submit, validate)
- **Config methods**: Synchronous methods for updating form/field configuration

## Usage Example

### Basic Usage

```tsx
import { Form } from 'efx-forms';
import { useForm } from 'efx-forms/useForm';

const FormLogger = () => {
  const { values, errors, dirty } = useForm();
  
  return (
    <div>
      <pre>Dirty: {String(dirty)}</pre>
      <pre>Values: {JSON.stringify(values)}</pre>
      <pre>Errors: {JSON.stringify(errors)}</pre>
    </div>
  );
};

const MyForm = () => (
  <Form name="user-form" onSubmit={console.log}>
    <FormLogger />
  </Form>
);
```

### Using Methods

```tsx
import { Form, Field } from 'efx-forms';
import { useForm } from 'efx-forms/useForm';

const FormControls = () => {
  const { reset, submit, values } = useForm();
  
  return (
    <div>
      <button type="button" onClick={reset}>Reset</button>
      <button type="button" onClick={submit}>Submit</button>
      <span>Fields: {Object.keys(values).length}</span>
    </div>
  );
};

const InputField = ({ name }) => {
  const { change } = useForm();
  
  return (
    <input
      onChange={(e) => change({ name, value: e.target.value })}
    />
  );
};

const Page = () => (
  <Form name="contact-form" onSubmit={console.log}>
    <Field name="email" Field={InputField} />
    <FormControls />
  </Form>
);
```

### Outside Form Context

```tsx
import { Form } from 'efx-forms';
import { useForm } from 'efx-forms/useForm';

const ExternalSubmit = () => {
  // Must provide formName when outside context
  const { submit, submitting } = useForm('login-form');
  
  return (
    <button onClick={submit} disabled={submitting}>
      {submitting ? 'Submitting...' : 'Submit Login'}
    </button>
  );
};

const Page = () => (
  <Form name="login-form" onSubmit={console.log}>
    {/* form fields */}
  </Form>
  <ExternalSubmit />
);
```

### Setting Configuration

```tsx
import { Form } from 'efx-forms';
import { useForm } from 'efx-forms/useForm';

const ConfigToggle = () => {
  const { setConfig, setFieldConfig } = useForm();
  
  return (
    <div>
      <button onClick={() => setConfig({ validateOnBlur: true })}>
        Enable onBlur Validation
      </button>
      <button onClick={() => setFieldConfig({ 
        name: 'email', 
        validateOnChange: true 
      })}>
        Enable onChange for Email
      </button>
    </div>
  );
};
```

## Related

- [`useFormData`](./useFormData.md) - Get form state only (no methods)
- [`useFormMethods`](./utilities.md#form-registry) - Get methods only (no state)
- [`useFormInstance`](./utilities.md#form-registry) - Get raw form instance
- [`useFormValues`](./utilities.md#form-registry) - Get values only

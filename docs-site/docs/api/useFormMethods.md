# useFormMethods

Get form methods only. Returns all form actions (change, reset, submit, validate) as effector events.

## Import

```ts
import { useFormMethods } from 'efx-forms/useFormMethods';
```

## Signature

```ts
function useFormMethods(formName?: string): {
  change: EventCallable<{ name: string; value: any }>;
  erase: EventCallable<void>;
  reset: EventCallable<void>;
  resetField: EventCallable<string>;
  resetUntouched: EventCallable<void>;
  setActive: EventCallable<{ name: string; value: boolean }>;
  setValues: EventCallable<Record<string, any>>;
  submit: Effect<ISubmitArgs, ISubmitResponseSuccess, ISubmitResponseError>;
  validate: EventCallable<IValidationParams>;
  setConfig: (cfg: IFormConfig) => void;
  setFieldConfig: (cfg: IFieldConfig) => void;
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `formName` | `string` | No | Form name. Auto-detected from context if not provided |

## Return Type

Object containing form methods:
- **Events**: `change`, `erase`, `reset`, `resetField`, `resetUntouched`, `setActive`, `setValues`, `validate`
- **Effect**: `submit`
- **Config methods**: `setConfig`, `setFieldConfig` (synchronous)

## Usage Example

### Custom Submit Button

```tsx
import { Form, Field } from 'efx-forms';
import { useFormMethods } from 'efx-forms/useFormMethods';

const CustomSubmit = () => {
  const { submit, reset } = useFormMethods();
  
  return (
    <div className="button-group">
      <button type="button" onClick={() => submit({})}>
        Submit Form
      </button>
      <button type="button" onClick={() => reset()}>
        Reset Form
      </button>
    </div>
  );
};

const MyForm = () => (
  <Form name="custom-form" onSubmit={console.log}>
    <Field name="name" Field={Input} label="Name" />
    <CustomSubmit />
  </Form>
);
```

### Programmatic Field Updates

```tsx
import { Form, useFormMethods } from 'efx-forms';

const AutoFillButton = () => {
  const { change, setValues } = useFormMethods();
  
  const handleAutoFill = () => {
    // Set individual field
    change({ name: 'email', value: 'test@example.com' });
    
    // Or set multiple values at once
    setValues({
      name: 'John Doe',
      phone: '555-1234',
    });
  };
  
  return <button type="button" onClick={handleAutoFill}>Auto-Fill</button>;
};
```

### External Form Control

```tsx
import { useFormMethods } from 'efx-forms/useFormMethods';

const ExternalControls = () => {
  const { submit, reset, validate } = useFormMethods('my-form');
  
  return (
    <div className="external-controls">
      <button onClick={() => validate({})}>Validate</button>
      <button onClick={() => submit({})}>Submit</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
```

### Update Form Configuration

```tsx
import { Form, useFormMethods } from 'efx-forms';

const ConfigToggle = () => {
  const { setConfig } = useFormMethods();
  
  const toggleValidation = () => {
    setConfig({
      validateOn: 'blur', // or 'change', 'submit'
    });
  };
  
  return (
    <button type="button" onClick={toggleValidation}>
      Toggle Validation Mode
    </button>
  );
};
```

## When to Use

Use `useFormMethods` when you need:
- Only form actions without state data
- To trigger form operations programmatically
- External form control components
- Minimal re-renders (methods don't change)

## Related

- [`useForm`](./useForm.md) - Get form data and methods combined
- [`useFormInstance`](./useFormInstance.md) - Get raw form with stores and events
- [`useFormValues`](./useFormValues.md) - Get form values only

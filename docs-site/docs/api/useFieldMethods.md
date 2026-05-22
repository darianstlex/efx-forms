# useFieldMethods

Get field methods only. Returns actions (change, reset, validate, setActive) for a specific field.

## Import

```ts
import { useFieldMethods } from 'efx-forms/useFieldMethods';
```

## Signature

```ts
function useFieldMethods(
  name: string,
  formName?: string
): {
  reset: () => void;
  validate: () => void;
  setActive: (value: boolean) => void;
  setValue: (value: any) => void;
  change: (value: any) => void;
  setConfig: (cfg: IFieldConfig) => void;
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Field name (e.g., `"email"`, `"address[0]"`) |
| `formName` | `string` | No | Form name. Auto-detected from context if not provided |

## Return Type

Object containing field methods:
- `reset()` - Reset field to initial value
- `validate()` - Trigger field validation
- `setActive(value: boolean)` - Set field active/focused state
- `setValue(value: any)` - Set field value directly
- `change(value: any)` - Change field value (triggers validation)
- `setConfig(cfg: IFieldConfig)` - Update field configuration

## Usage Example

### Custom Field with Methods

```tsx
import { Form, useFieldMethods } from 'efx-forms';

const FieldWithControls = ({ name, label }: { name: string; label: string }) => {
  const { reset, validate, setValue } = useFieldMethods(name);
  
  return (
    <div>
      <label>{label}</label>
      <input name={name} />
      <div className="controls">
        <button type="button" onClick={() => setValue('default')}>
          Set Default
        </button>
        <button type="button" onClick={reset}>
          Reset
        </button>
        <button type="button" onClick={validate}>
          Validate
        </button>
      </div>
    </div>
  );
};

const MyForm = () => (
  <Form name="controls-form" onSubmit={console.log}>
    <FieldWithControls name="email" label="Email" />
  </Form>
);
```

### Auto-Fill Button

```tsx
import { Form, Field, useFieldMethods } from 'efx-forms';

const AutoFillButton = () => {
  const { setValue } = useFieldMethods('email');
  
  return (
    <button type="button" onClick={() => setValue('test@example.com')}>
      Auto-Fill Email
    </button>
  );
};

const MyForm = () => (
  <Form name="autofill-form" onSubmit={console.log}>
    <Field name="email" Field={Input} label="Email" />
    <AutoFillButton />
  </Form>
);
```

### Focus Management

```tsx
import { Form, Field, useFieldMethods } from 'efx-forms';

const FocusButton = ({ fieldName }: { fieldName: string }) => {
  const { setActive } = useFieldMethods(fieldName);
  
  return (
    <button type="button" onClick={() => setActive(true)}>
      Focus {fieldName}
    </button>
  );
};
```

### Update Field Config

```tsx
import { Form, useFieldMethods } from 'efx-forms';

const ConfigToggle = ({ fieldName }: { fieldName: string }) => {
  const { setConfig } = useFieldMethods(fieldName);
  
  const toggleRequired = () => {
    setConfig({
      validators: [required()], // Update validators
    });
  };
  
  return (
    <button type="button" onClick={toggleRequired}>
      Toggle Required
    </button>
  );
};
```

## When to Use

Use `useFieldMethods` when you need:
- Only field actions without state data
- To trigger field operations programmatically
- External field control components
- Minimal re-renders (methods don't change)

## Related

- [`useFieldData`](./useFieldData.md) - Get field state and methods combined
- [`useFormMethods`](./useFormMethods.md) - Get form-level methods
- [`FieldDataProvider`](./field-data-provider.md) - Render prop for field state

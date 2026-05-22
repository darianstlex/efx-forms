# useField

Get field data and methods combined. Returns field state and control methods for a specific field.

## Import

```ts
import { useField } from 'efx-forms/useField';
```

## Signature

```ts
function useField(
  name: string,
  formName?: string
): {
  // State (plain values)
  value: any;
  active: boolean;
  dirty: boolean;
  error: string | null;
  errors: string[] | null;
  
  // Methods
  change: (value: any) => void;
  setValue: (value: any) => void;
  reset: () => void;
  validate: () => void;
  setActive: (value: boolean) => void;
  setConfig: (cfg: IFieldConfig) => void;
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Field name (e.g., `'email'`, `'user.name'`, `'address[0]'`) |
| `formName` | `string` | No | Form name. Auto-detected from context if not provided. Required when used outside `<Form>` context or targeting a different form. |

## Return Type

Object containing:
- **State properties**: Current field state (value, active, dirty, error, errors)
- **Methods**: Field control functions (change, setValue, reset, validate, setActive)
- **Config method**: `setConfig` for updating field configuration

## Usage Example

### Basic Usage

```tsx
import { Form, Field } from 'efx-forms';
import { useField } from 'efx-forms/useField';

const CustomInput = ({ name }) => {
  const { value, error, change } = useField(name);
  
  return (
    <div>
      <input
        value={value || ''}
        onChange={(e) => change(e.target.value)}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
};

const Page = () => (
  <Form name="login-form" onSubmit={console.log}>
    <Field name="email" Field={CustomInput} />
  </Form>
);
```

### Field with Multiple Controls

```tsx
import { Form } from 'efx-forms';
import { useField } from 'efx-forms/useField';

const AgeField = () => {
  const { value, dirty, reset, validate } = useField('age');
  
  return (
    <div>
      <input
        type="number"
        value={value || ''}
        onChange={(e) => {
          // Custom logic before setting value
          const num = parseInt(e.target.value, 10);
          // change() would be called via Field wrapper
        }}
      />
      <div>
        <button type="button" onClick={reset}>Reset</button>
        <button type="button" onClick={validate}>Validate</button>
        {dirty && <span>Changed</span>}
      </div>
    </div>
  );
};

const Page = () => (
  <Form name="user-form" onSubmit={console.log}>
    <AgeField />
  </Form>
);
```

### Conditional Field Visibility

```tsx
import { Form, Field } from 'efx-forms';
import { useField } from 'efx-forms/useField';

const ConditionalField = () => {
  const { value: showEmail } = useField('showEmail');
  
  return (
    <div>
      <Field name="showEmail" Field={({ value, change }) => (
        <label>
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => change(e.target.checked)}
          />
          Show Email Field
        </label>
      )} />
      
      {showEmail && (
        <Field name="email" Field={Input} label="Email" />
      )}
    </div>
  );
};
```

### Setting Field Active State

```tsx
import { Form } from 'efx-forms';
import { useField } from 'efx-forms/useField';

const FocusManager = () => {
  const { setActive: setEmailActive } = useField('email');
  const { setActive: setNameActive } = useField('name');
  
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setNameActive(true);
          setEmailActive(false);
        }}
      >
        Focus Name
      </button>
      <button
        type="button"
        onClick={() => {
          setEmailActive(true);
          setNameActive(false);
        }}
      >
        Focus Email
      </button>
    </div>
  );
};

const Page = () => (
  <Form name="contact-form" onSubmit={console.log}>
    <Field name="name" Field={Input} />
    <Field name="email" Field={Input} />
    <FocusManager />
  </Form>
);
```

### Outside Form Context

```tsx
import { Form } from 'efx-forms';
import { useField } from 'efx-forms/useField';

const ExternalFieldMonitor = () => {
  // Must provide formName when outside context
  const { value, error } = useField('password', 'signup-form');
  
  return (
    <div>
      <span>Password: {value ? '***' : 'empty'}</span>
      {error && <span className="error">{error}</span>}
    </div>
  );
};

const Page = () => (
  <Form name="signup-form" onSubmit={console.log}>
    <Field name="password" Field={Input} />
  </Form>
  <ExternalFieldMonitor />
);
```

### Setting Field Configuration

```tsx
import { Form } from 'efx-forms';
import { useField } from 'efx-forms/useField';

const FieldConfigToggle = () => {
  const { setConfig } = useField('email');
  
  return (
    <button
      type="button"
      onClick={() => setConfig({
        validateOnBlur: true,
        validateOnChange: false,
      })}
    >
      Enable onBlur Validation for Email
    </button>
  );
};
```

## Related

- [`useFieldData`](/docs/api/useFieldData) - Get field state only (no methods)
- [`useFieldStore`](/docs/api/useFieldStore) - Get single field store value
- [`useForm`](/docs/api/useForm) - Get entire form data and methods
- [Field Component](/docs/api/field)

# useFieldData

Get field state data. Returns value, error, active, dirty, and errors for a specific field.

## Import

```ts
import { useFieldData } from 'efx-forms/useFieldData';
```

## Signature

```ts
function useFieldData(
  name: string,
  formName?: string
): {
  value: any;
  active: boolean;
  dirty: boolean;
  error: string | null;
  errors: string[] | null;
}
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Field name (e.g., `"email"`, `"address[0]"`) |
| `formName` | `string` | No | Form name. Auto-detected from context if not provided |

## Return Type

Object containing field state:
- `value` - Current field value
- `active` - Whether field is active (focused)
- `dirty` - Whether field has been modified
- `error` - Primary error message (or null)
- `errors` - Array of all error messages (or null)

## Usage Example

### Custom Field Component

```tsx
import { Form, useFieldData } from 'efx-forms';

const CustomInput = ({ name, label }: { name: string; label: string }) => {
  const { value, error, dirty, active } = useFieldData(name);
  
  return (
    <div className={active ? 'active' : ''}>
      <label>{label}</label>
      <input value={value || ''} />
      {error && <span className="error">{error}</span>}
      {dirty && <span className="dirty-indicator">●</span>}
    </div>
  );
};

const MyForm = () => (
  <Form name="custom-form" onSubmit={console.log}>
    <CustomInput name="email" label="Email" />
    <CustomInput name="password" label="Password" />
  </Form>
);
```

### Field Status Display

```tsx
import { Form, Field, useFieldData } from 'efx-forms';

const FieldStatus = ({ fieldName }: { fieldName: string }) => {
  const { value, error, dirty, active } = useFieldData(fieldName);
  
  return (
    <div className="field-status">
      <span>Value: {String(value)}</span>
      <span>Active: {String(active)}</span>
      <span>Dirty: {String(dirty)}</span>
      {error && <span className="error">Error: {error}</span>}
    </div>
  );
};

const MyForm = () => (
  <Form name="status-form" onSubmit={console.log}>
    <Field name="username" Field={Input} label="Username" />
    <FieldStatus fieldName="username" />
  </Form>
);
```

### Outside Form Context

```tsx
import { useFieldData } from 'efx-forms/useFieldData';

const ExternalFieldMonitor = () => {
  const { value, error } = useFieldData('email', 'my-form');
  
  return (
    <div>
      <p>Email: {value || '(empty)'}</p>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
```

## When to Use

Use `useFieldData` when you need:
- Complete field state in one hook
- To build custom field components
- Access to field metadata (active, dirty, errors)
- Alternative to FieldDataProvider component

## Related

- [`FieldDataProvider`](./field-data-provider.md) - Render prop alternative
- [`useFieldStore`](./useFieldStore.md) - Get single field store value
- [`useFieldMethods`](./useFieldMethods.md) - Get field methods only

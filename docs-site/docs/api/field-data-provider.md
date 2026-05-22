# FieldDataProvider

Subscribe to individual field values. Provides field state data to child components via render props pattern.

## Import

```ts
import { FieldDataProvider } from 'efx-forms/FieldDataProvider';
```

## Signature

```tsx
function FieldDataProvider({
  children,
  name,
  formName,
}: {
  children: (data: FieldState) => ReactElement;
  name: string;
  formName?: string;
}): ReactElement
```

Where `FieldState` contains:

```ts
{
  value: any;
  error: string | null;
  active: boolean;
  dirty: boolean;
  touched: boolean;
  valid: boolean;
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `(data: FieldState) => ReactElement` | Yes | Render prop function that receives field state |
| `name` | `string` | Yes | Field name (e.g., `"email"`, `"address[0]"`) |
| `formName` | `string` | No | Form name. Auto-detected from context if not provided |

## Usage Example

### Display Field State

```tsx
import { Form, Field } from 'efx-forms';
import { FieldDataProvider } from 'efx-forms/FieldDataProvider';

const InputWithState = ({ label, ...props }) => (
  <div>
    <label>{label}</label>
    <input {...props} />
    
    <FieldDataProvider name={props.name}>
      {({ value, error, dirty, touched }) => (
        <div className="field-state">
          {dirty && <span className="dirty">Modified</span>}
          {touched && <span className="touched">Touched</span>}
          {error && <span className="error">{error}</span>}
        </div>
      )}
    </FieldDataProvider>
  </div>
);

const MyForm = () => (
  <Form name="user-form" onSubmit={console.log}>
    <Field name="email" Field={InputWithState} label="Email" />
  </Form>
);
```

### Conditional Field Rendering

```tsx
import { Form, Field, FieldDataProvider } from 'efx-forms';

const ConditionalField = () => (
  <Form name="conditional-form" onSubmit={console.log}>
    <Field name="showDetails" Field={Checkbox} label="Show Details" />
    
    <FieldDataProvider name="showDetails">
      {({ value }) =>
        value && (
          <Field name="details" Field={TextArea} label="Additional Details" />
        )
      }
    </FieldDataProvider>
  </Form>
);
```

### Field Value Monitor

```tsx
import { Form, Field, FieldDataProvider } from 'efx-forms';

const FieldMonitor = ({ fieldName }: { fieldName: string }) => (
  <FieldDataProvider name={fieldName}>
    {({ value, dirty, error }) => (
      <div className="monitor">
        <strong>{fieldName}:</strong> {String(value)}
        {dirty && <span className="indicator">●</span>}
        {error && <span className="error">!</span>}
      </div>
    )}
  </FieldDataProvider>
);
```

## When to Use

Use `FieldDataProvider` when you need:
- To display individual field state in real-time
- Conditional rendering based on a specific field's value
- Access to field metadata (dirty, touched, error)
- Render prop pattern instead of hooks

## Related

- [`FormDataProvider`](./form-data-provider.md) - Subscribe to entire form state
- [`useFieldData`](./useFieldData.md) - Hook alternative to FieldDataProvider
- [`IfFieldValue`](./if-field-value.md) - Conditional rendering based on field value

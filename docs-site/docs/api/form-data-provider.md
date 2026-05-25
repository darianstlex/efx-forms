# FormDataProvider

Subscribe to form values and errors. Provides form state data to child components via render props pattern.

## Import

```ts
import { FormDataProvider } from 'efx-forms/FormDataProvider';
```

## Signature

```tsx
function FormDataProvider({
  children,
  name,
}: {
  children: (data: FormState) => ReactElement;
  name?: string;
}): ReactElement
```

Where `FormState` contains:

```ts
{
  values: IRValues;
  errors: IRErrors;
  active: IRBoolean;
  dirties: IRBoolean;
  dirty: boolean;
  touched: boolean;
  touches: IRBoolean;
  valid: boolean;
  submitting: boolean;
  activeValues: IRValues;
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `(data: FormState) => ReactElement` | Yes | Render prop function that receives form state |
| `name` | `string` | No | Form name. Auto-detected from context if not provided |

## Usage Example

### Display Form Values

```tsx
import { Form, Field } from 'efx-forms';
import { FormDataProvider } from 'efx-forms/FormDataProvider';

const Input = ({ label, error, value, onChange, onBlur, ...props }) => (
  <div>
    <label>{label}</label>
    <input value={value || ''} onChange={onChange} onBlur={onBlur} {...props} />
    {error && <span className="error">{error}</span>}
  </div>
);

const FormWithPreview = () => (
  <Form name="preview-form" onSubmit={console.log}>
    <Field name="name" Field={Input} label="Name" />
    <Field name="email" Field={Input} label="Email" type="email" />
    
    <FormDataProvider>
      {({ values, errors, dirty }) => (
        <div className="preview">
          <h4>Live Preview</h4>
          <pre>{JSON.stringify(values, null, 2)}</pre>
          <p>Dirty: {String(dirty)}</p>
          {Object.keys(errors).length > 0 && (
            <div className="errors">
              <h4>Errors:</h4>
              <pre>{JSON.stringify(errors, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </FormDataProvider>
    
    <button type="submit">Submit</button>
  </Form>
);
```

### Conditional Rendering Based on Form State

```tsx
import { Form, FormDataProvider } from 'efx-forms';

const SubmitWarning = () => (
  <FormDataProvider>
    {({ values, dirty }) => {
      if (!dirty) {
        return <p className="info">Make changes before submitting</p>;
      }
      
      if (Object.keys(values).length === 0) {
        return <p className="warning">Form is empty</p>;
      }
      
      return <p className="success">Ready to submit!</p>;
    }}
  </FormDataProvider>
);
```

### Outside Form Context

```tsx
import { FormDataProvider } from 'efx-forms/FormDataProvider';

const ExternalFormMonitor = () => (
  <FormDataProvider name="my-form">
    {({ values, submitting }) => (
      <div>
        <p>Form is submitting: {String(submitting)}</p>
        <pre>{JSON.stringify(values)}</pre>
      </div>
    )}
  </FormDataProvider>
);
```

## When to Use

Use `FormDataProvider` when you need:
- To display form values in real-time
- Conditional rendering based on form state
- Access to multiple form state properties at once
- Render prop pattern instead of hooks

## Related

- [`FieldDataProvider`](./field-data-provider.md) - Subscribe to individual field values
- [`useFormData`](./useFormData.md) - Hook alternative to FormDataProvider
- [`IfFormValues`](./if-form-values.md) - Conditional rendering based on values

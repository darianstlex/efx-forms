# IfFormValues

Conditional rendering based on form values. Shows or hides content when a condition function returns true.

## Import

```ts
import { IfFormValues } from 'efx-forms/IfFormValues';
```

## Signature

```tsx
function IfFormValues({
  children,
  check,
  form,
  setTo,
  resetTo,
  render,
  updateDebounce = 0,
}: {
  children: ReactNode;
  check: (values: Record<string, any>, activeValues: Record<string, any>) => boolean;
  form?: string;
  setTo?: Record<string, any>;
  resetTo?: Record<string, any>;
  render?: (values: Record<string, any>) => ReactNode;
  updateDebounce?: number;
}): ReactElement | null
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Content to render when condition is true |
| `check` | `(values, activeValues) => boolean` | Yes | Condition function that receives form values |
| `form` | `string` | No | Form name. Auto-detected from context if not provided |
| `setTo` | `Record<string, any>` | No | Values to set when condition becomes true |
| `resetTo` | `Record<string, any>` | No | Values to set when condition becomes false |
| `render` | `(values) => ReactNode` | No | Alternative to children - render prop with values |
| `updateDebounce` | `number` | No | Debounce delay in ms for setTo/resetTo (default: 0) |

## Usage Example

### Basic Conditional Rendering

```tsx
import { Form, Field, IfFormValues } from 'efx-forms';

const Input = ({ label, ...props }) => (
  <div>
    <label>{label}</label>
    <input {...props} />
  </div>
);

const ConditionalForm = () => (
  <Form name="conditional-form" onSubmit={console.log}>
    <Field name="age" Field={Input} label="Age" type="number" />
    
    {/* Show when age >= 18 */}
    <IfFormValues check={({ age }) => age >= 18}>
      <div className="adult-content">
        <Field name="license" Field={Input} label="Driver's License" />
      </div>
    </IfFormValues>
    
    <button type="submit">Submit</button>
  </Form>
);
```

### Auto-Fill Values on Show

```tsx
import { Form, Field, IfFormValues } from 'efx-forms';

const AutoFillForm = () => (
  <Form name="auto-fill-form" onSubmit={console.log}>
    <Field name="country" Field={Input} label="Country" />
    
    {/* Auto-fill state when country is USA */}
    <IfFormValues
      check={({ country }) => country === 'USA'}
      setTo={{ state: 'California', zip: '90210' }}
      resetTo={{ state: '', zip: '' }}
    >
      <div>
        <Field name="state" Field={Input} label="State" />
        <Field name="zip" Field={Input} label="ZIP" />
      </div>
    </IfFormValues>
  </Form>
);
```

### Using Render Prop

```tsx
import { Form, IfFormValues } from 'efx-forms';

const ValueDisplay = () => (
  <Form name="display-form" onSubmit={console.log}>
    <IfFormValues
      check={({ showDebug }) => showDebug}
      render={(values) => (
        <pre className="debug">{JSON.stringify(values, null, 2)}</pre>
      )}
    />
  </Form>
);
```

### Debounced Updates

```tsx
import { Form, Field, IfFormValues } from 'efx-forms';

const DebouncedForm = () => (
  <Form name="debounced-form" onSubmit={console.log}>
    <Field name="enableExtra" Field={Checkbox} label="Enable Extra Fields" />
    
    <IfFormValues
      check={({ enableExtra }) => enableExtra}
      setTo={{ extra1: 'default1', extra2: 'default2' }}
      updateDebounce={500} // Wait 500ms before setting values
    >
      <div>
        <Field name="extra1" Field={Input} />
        <Field name="extra2" Field={Input} />
      </div>
    </IfFormValues>
  </Form>
);
```

## When to Use

Use `IfFormValues` when you need:
- Show/hide content based on form values
- Auto-fill or reset fields based on conditions
- Conditional rendering with access to all form values
- Debounced value updates

## Related

- [`IfFieldValue`](./if-field-value.md) - Conditional rendering based on single field
- [`FormDataProvider`](./form-data-provider.md) - Subscribe to form values
- [`useFormValues`](./useFormValues.md) - Hook to get form values

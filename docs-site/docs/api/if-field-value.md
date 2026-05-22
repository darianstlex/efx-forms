# IfFieldValue

Conditional rendering based on a specific field value. Shows or hides content when a condition function returns true.

## Import

```ts
import { IfFieldValue } from 'efx-forms/IfFieldValue';
```

## Signature

```tsx
function IfFieldValue({
  children,
  check,
  field,
  formName,
  render,
}: {
  children: ReactNode;
  check: (value: any) => boolean;
  field: string;
  formName?: string;
  render?: (value: any) => ReactNode;
}): ReactElement | null
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | Content to render when condition is true |
| `check` | `(value) => boolean` | Yes | Condition function that receives field value |
| `field` | `string` | Yes | Field name to watch (e.g., `"status"`, `"enabled"`) |
| `formName` | `string` | No | Form name. Auto-detected from context if not provided |
| `render` | `(value) => ReactNode` | No | Alternative to children - render prop with field value |

## Usage Example

### Basic Conditional Rendering

```tsx
import { Form, Field, IfFieldValue } from 'efx-forms';

const Input = ({ label, ...props }) => (
  <div>
    <label>{label}</label>
    <input {...props} />
  </div>
);

const StatusForm = () => (
  <Form name="status-form" onSubmit={console.log}>
    <Field name="status" Field={Input} label="Status" />
    
    {/* Show when status is 'active' */}
    <IfFieldValue
      field="status"
      check={(value) => value === 'active'}
    >
      <div className="active-content">
        <p>Status is active!</p>
        <Field name="activeField" Field={Input} label="Active Field" />
      </div>
    </IfFieldValue>
    
    <button type="submit">Submit</button>
  </Form>
);
```

### Using Render Prop

```tsx
import { Form, Field, IfFieldValue } from 'efx-forms';

const RenderPropForm = () => (
  <Form name="render-form" onSubmit={console.log}>
    <Field name="status" Field={Input} label="Status" />
    
    <IfFieldValue
      field="status"
      check={(value) => value !== ''}
      render={(value) => (
        <div className="status-display">
          Current status: <strong>{value}</strong>
        </div>
      )}
    />
  </Form>
);
```

### Nested Conditionals

```tsx
import { Form, Field, IfFieldValue, IfFormValues } from 'efx-forms';

const NestedForm = () => (
  <Form name="nested-form" onSubmit={console.log}>
    <Field name="enabled" Field={Checkbox} label="Enable Feature" />
    <Field name="level" Field={Input} label="Level" type="number" />
    
    <IfFieldValue
      field="enabled"
      check={(enabled) => enabled}
    >
      <IfFormValues check={({ level }) => level > 10}>
        <div className="high-level">
          <Field name="highLevelField" Field={Input} label="High Level Field" />
        </div>
      </IfFormValues>
    </IfFieldValue>
  </Form>
);
```

### Multiple Conditions on Same Field

```tsx
import { Form, Field, IfFieldValue } from 'efx-forms';

const MultiConditionForm = () => (
  <Form name="multi-form" onSubmit={console.log}>
    <Field name="accountType" Field={Select} label="Account Type" />
    
    {/* Show for Premium */}
    <IfFieldValue
      field="accountType"
      check={(value) => value === 'premium'}
    >
      <div className="premium">
        <Field name="premiumFeature" Field={Input} label="Premium Feature" />
      </div>
    </IfFieldValue>
    
    {/* Show for Enterprise */}
    <IfFieldValue
      field="accountType"
      check={(value) => value === 'enterprise'}
    >
      <div className="enterprise">
        <Field name="enterpriseFeature" Field={Input} label="Enterprise Feature" />
      </div>
    </IfFieldValue>
  </Form>
);
```

## When to Use

Use `IfFieldValue` when you need:
- Show/hide content based on a single field's value
- Simpler alternative to `IfFormValues` for single-field conditions
- Conditional rendering with render prop pattern
- Nested conditionals with other form components

## Related

- [`IfFormValues`](./if-form-values.md) - Conditional rendering based on all form values
- [`FieldDataProvider`](./field-data-provider.md) - Subscribe to field state
- [`useFieldStore`](./useFieldStore.md) - Hook to get single field value

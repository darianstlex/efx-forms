---
sidebar_position: 3
---

# Advanced Patterns

Conditional rendering, dynamic forms, and advanced techniques.

## Conditional Rendering with IfFormValues

Show or hide content based on form values:

```jsx
import { Form, Field, IfFormValues } from 'efx-forms';

function Input({ id, label, value, error, ...props }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} value={value || ''} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

function ConditionalForm() {
  return (
    <Form name="conditional-form" onSubmit={(values) => console.log(values)}>
      <Field name="age" Field={Input} label="Age" type="number" />
      
      {/* Show when age >= 18 */}
      <IfFormValues check={({ age }) => age >= 18}>
        <div className="adult-content">
          <Field name="license" Field={Input} label="Driver's License Number" />
        </div>
      </IfFormValues>
      
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Auto-Fill with setTo

Automatically set field values when condition becomes true:

```jsx
import { Form, Field, IfFormValues } from 'efx-forms';

function AutoFillForm() {
  return (
    <Form name="autofill-form" onSubmit={(values) => console.log(values)}>
      <Field name="subscribe" Field={Checkbox} label="Subscribe to newsletter" />
      
      <IfFormValues 
        check={({ subscribe }) => subscribe}
        setTo={{ email: 'subscribe@example.com' }}
      >
        <Field name="email" Field={Input} label="Email" type="email" />
      </IfFormValues>
      
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Clear Values with resetTo

Reset field values when condition becomes false:

```jsx
import { Form, Field, IfFormValues } from 'efx-forms';

function ResetOnHideForm() {
  return (
    <Form name="reset-form" onSubmit={(values) => console.log(values)}>
      <Field name="showExtra" Field={Checkbox} label="Show extra field" />
      
      <IfFormValues 
        check={({ showExtra }) => showExtra}
        resetTo={{ extra: '' }}
      >
        <Field name="extra" Field={Input} label="Extra Field" />
      </IfFormValues>
      
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Conditional Rendering with IfFieldValue

Simpler conditional based on single field value:

```jsx
import { Form, Field, IfFieldValue } from 'efx-forms';

function StatusForm() {
  return (
    <Form name="status-form" onSubmit={(values) => console.log(values)}>
      <Field name="status" Field={Input} label="Status" />
      
      <IfFieldValue 
        field="status"
        check={(value) => value === 'active'}
      >
        <div className="status-message">Status is active</div>
      </IfFieldValue>
      
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Render Prop Pattern

Custom rendering with field value:

```jsx
import { Form, Field, IfFieldValue } from 'efx-forms';

function RenderPropForm() {
  return (
    <Form name="render-form" onSubmit={(values) => console.log(values)}>
      <Field name="status" Field={Input} label="Status" />
      
      <IfFieldValue 
        field="status"
        check={(value) => value === 'active'}
        render={(value) => <div>Current status: {value}</div>}
      />
      
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Nested Conditionals

Combine multiple conditional components:

```jsx
import { Form, Field, IfFormValues, IfFieldValue } from 'efx-forms';

function NestedConditionalForm() {
  return (
    <Form name="nested-form" onSubmit={(values) => console.log(values)}>
      <Field name="enabled" Field={Checkbox} label="Enable feature" />
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
      
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Dynamic Fields

Render fields dynamically based on form state:

```jsx
import { Form, Field, FormDataProvider } from 'efx-forms';

function DynamicFieldsForm() {
  const fieldCount = 3;
  
  return (
    <Form name="dynamic-form" onSubmit={(values) => console.log(values)}>
      <FormDataProvider>
        {({ values }) => (
          <>
            <Field name="count" Field={Input} label="Number of fields" type="number" />
            
            {Array.from({ length: values.count || fieldCount }).map((_, idx) => (
              <Field
                key={idx}
                name={`dynamic[${idx}]`}
                Field={Input}
                label={`Dynamic Field ${idx + 1}`}
              />
            ))}
          </>
        )}
      </FormDataProvider>
      
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Using Form Hooks Outside Form Context

Access form data and methods programmatically:

```jsx
import { Form, Field, useFormValues, useFormMethods } from 'efx-forms';

function FormWithExternalControl() {
  const values = useFormValues();
  const { reset, setValues } = useFormMethods();
  
  return (
    <div>
      <Form name="external-control-form" onSubmit={(values) => console.log(values)}>
        <Field name="name" Field={Input} label="Name" />
        <Field name="email" Field={Input} label="Email" type="email" />
        <button type="submit">Submit</button>
      </Form>
      
      {/* External controls */}
      <div className="controls">
        <button onClick={reset}>Reset Form</button>
        <button onClick={() => setValues({ name: 'John', email: 'john@example.com' })}>
          Fill Form
        </button>
        <pre>Current values: {JSON.stringify(values, null, 2)}</pre>
      </div>
    </div>
  );
}
```

## Using getForm Outside Component Tree

Access form instance from anywhere:

```jsx
import { Form, Field, getForm } from 'efx-forms';

// Get form instance by name
const form = getForm({ name: 'my-form' });

// Access form stores
form.$values.watch((values) => {
  console.log('Form values changed:', values);
});

// Call form methods
form.reset();
form.setValues({ name: 'John' });

function ExternalFormAccess() {
  return (
    <Form name="my-form" onSubmit={(values) => console.log(values)}>
      <Field name="name" Field={Input} label="Name" />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Debounced Updates

Debounce conditional rendering updates:

```jsx
import { Form, Field, IfFormValues } from 'efx-forms';

function DebouncedForm() {
  return (
    <Form name="debounced-form" onSubmit={(values) => console.log(values)}>
      <Field name="search" Field={Input} label="Search" />
      
      <IfFormValues 
        check={({ search }) => search.length > 2}
        updateDebounce={300} // Wait 300ms after typing stops
      >
        <div className="search-results">
          Search results for: {values.search}
        </div>
      </IfFormValues>
      
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Form Data Provider Patterns

Subscribe to form data changes:

```jsx
import { Form, Field, FormDataProvider, FieldDataProvider } from 'efx-forms';

function DataProviderForm() {
  return (
    <Form name="provider-form" onSubmit={(values) => console.log(values)}>
      <Field name="username" Field={Input} label="Username" />
      <Field name="email" Field={Input} label="Email" type="email" />
      
      {/* Subscribe to all form data */}
      <FormDataProvider>
        {({ values, errors, touched, dirty }) => (
          <div className="form-debug">
            <h4>Form State</h4>
            <p>Dirty: {dirty ? 'Yes' : 'No'}</p>
            <p>Touched: {touched ? 'Yes' : 'No'}</p>
            <p>Errors: {Object.keys(errors).length}</p>
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </div>
        )}
      </FormDataProvider>
      
      {/* Subscribe to single field */}
      <FieldDataProvider name="username">
        {({ value, active }) => (
          <div>
            Username: {value} (Active: {active ? 'Yes' : 'No'})
          </div>
        )}
      </FieldDataProvider>
      
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Next Steps

- Explore more patterns in the [efx-forms-cra](https://github.com/darianstlex/efx-forms-cra) repository
- Check the [API Reference](../api/components.md) for complete component documentation

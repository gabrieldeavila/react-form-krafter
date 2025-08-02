---
sidebar_position: 4
---

# Hooks

Hooks can be used inside the form to access the form API.

There are seperate hooks for different purposes, use the one that fits your needs.

We strongly recommend to create components that only use the hooks they need, to avoid unnecessary re-renders.

### useForm

The `useForm` hook provides access to all of the FormContext values, including the form state, field states, and helper functions.

Use it to interact with the form programmatically, such as resetting the form, submitting it, or updating field values.

```jsx title="src/components/fields/FieldBase.jsx"
import { useForm } from "react-form-krafter";
const MyComponent = () => {
  const formApi = useForm();

  const handleReset = () => {
    formApi.reset();
  };

  return (
    <button type="button" onClick={handleReset}>
      Reset Form
    </button>
  );
};
```

### useFieldsState

The `useFieldsState` hook allows you to access the state of all fields in the form. This is useful for displaying field-specific information.

```jsx title="src/components/fields/FieldBase.jsx"
import { useFieldsState } from "react-form-krafter";

const MyComponent = () => {
  const fieldsState = useFieldsState();

  return (
    <div>
      {Object.entries(fieldsState).map(([fieldName, fieldValue]) => (
        <div key={fieldName}>
          <strong>{fieldName}</strong>: {fieldValue}
        </div>
      ))}
    </div>
  );
};
```

### useFieldsInfo

The `useFieldsInfo` hook provides metadata about all fields in the form, such as which fields are touched, focused, dirty, or have errors. This is useful for displaying validation states or other field-specific information.

```jsx title="src/components/fields/FieldBase.jsx"
import { useFieldsInfo } from "react-form-krafter";

const MyComponent = () => {
  const fieldsInfo = useFieldsInfo();

  return (
    <div>
      <h3>Touched Fields</h3>
      <ul>
        {fieldsInfo.touched.map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>
      <h3>Focused Fields</h3>
      <ul>
        {fieldsInfo.focused.map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>
      <h3>Dirty Fields</h3>
      <ul>
        {fieldsInfo.dirty.map((field) => (
          <li key={field}>{field}</li>
        ))}
      </ul>
    </div>
  );
};
```

### useFieldsErrors

The `useFieldsErrors` hook provides access to the error messages for each field in the form. This is useful for displaying validation errors or other field-specific issues.

```jsx title="src/components/fields/FieldBase.jsx"
import { useFieldsErrors } from "react-form-krafter";

const MyComponent = () => {
  const fieldsErrors = useFieldsErrors();

  return (
    <div>
      {Object.entries(fieldsErrors).map(([fieldName, errorMessage]) => (
        <div key={fieldName}>
          <strong>{fieldName}</strong>: {errorMessage}
        </div>
      ))}
    </div>
  );
};
```

### useFieldValue

The `useFieldValue` hook allows you to access the value of a specific field in the form. This is useful for displaying or manipulating individual field values.

```jsx title="src/components/fields/FieldBase.jsx"
import { useFieldValue } from "react-form-krafter";
const MyComponent = ({ fieldName }) => {
  const fieldValue = useFieldValue(fieldName);

  return (
    <div>
      <strong>{fieldName}</strong>: {fieldValue}
    </div>
  );
};
```

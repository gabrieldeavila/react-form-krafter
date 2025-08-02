---
sidebar_position: 3
---

# Fields
Fields are the building blocks of your forms in `react-form-krafter`.

They are reusable components that encapsulate the logic and UI for a specific type of input.

## Using a registered field
Your field will look like this:

```js title="src/components/fields/fieldExample.js"
export const BaseField = {
  name: "string",
  label: "string",
  initialValue: undefined,
  required: false,
  placeholder: "string",
  disabled: false,
  options: [],
  metadata: {}, // Additional metadata for the field
  wrapperClassName: "string", // Custom class for the field wrapper
  inputClassName: "string", // Custom class for the field input
  type: "text", // or "number", "select", etc.
};
```

### Properties
| Name           | Description                                                           | Required |
|----------------|------------------------------------------------------------------------|----------|
| `name`         | A unique identifier for the field.                                     | ✅        |
| `label`        | Text label displayed alongside the field in the UI.                    | ✅        |
| `initialValue` | The default value assigned when the form is first rendered.            | ❌        |
| `required`     | Marks the field as mandatory for submission.                           | ❌        |
| `placeholder`  | Hint text shown inside the input when it's empty.                      | ❌        |
| `disabled`     | Whether the field starts as disabled and not editable by the user.     | ❌        |
| `options`      | An array of `{ label, value }` pairs used for select, radio, or similar field types. | ❌        |
| `metadata`    | Additional metadata for the field, such as validation rules or custom properties. | ❌        |
| `wrapperClassName` | A custom class name for the field wrapper, allowing for custom styling. | ❌        |
| `inputClassName`    | A custom class name for the field element itself, allowing for custom styling. | ❌        |
| `type`         | Defines the field's type (e.g., `"text"`, `"number"`, `"select"`), which maps to the registered component. | ✅        |
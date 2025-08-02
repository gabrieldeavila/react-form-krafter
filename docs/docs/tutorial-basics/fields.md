---
sidebar_position: 3
---

# Fields

Fields are the building blocks of your forms in `react-form-krafter`.

They are reusable components that encapsulate the logic and UI for a specific type of input.

## Run Time Properties

These are dynamic — generated internally as the user interacts with the form. They let the input component behave/react accordingly:

- **`value`**: The current value of the field.
- **`isTouched`**: Indicates whether the user has interacted with the field.
- **`isDirty`**: Indicates whether the field’s value has changed from its initial value.
- **`isFocused`**: Indicates whether the field is currently focused.
- **`isDefaultValue`**: True if the field’s current value matches the initial value.
- **`isPristine`**: True if the field has not been modified since it was last reset.
- **`isBlurred`**: Indicates whether the field has lost focus at least once.
- **`isDisabled`**: Whether the field is currently disabled.
- **`error`**: Contains any validation error message related to the field, or `null` if there's no error.
- **`isErrorVisible`**: Determines whether the error message should be displayed (e.g., after the field is blurred or the form has been submitted).
- **`onChange`**: Callback function triggered when the field’s value changes.
- **`onBlur`**: Callback function triggered when the field loses focus.
- **`onFocus`**: Callback function triggered when the field gains focus.

## Methods

These are functions provided to manage the field's state and behavior:

- **`onChange(value)`**: Updates the field's value and triggers validation.
- **`onBlur()`**: Marks the field as blurred, triggering any associated validation.
- **`onFocus()`**: Marks the field as focused, allowing you to handle focus-related logic.

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

| Name               | Description                                                                                                | Required |
| ------------------ | ---------------------------------------------------------------------------------------------------------- | -------- |
| `name`             | A unique identifier for the field.                                                                         | ✅       |
| `label`            | Text label displayed alongside the field in the UI.                                                        | ✅       |
| `initialValue`     | The default value assigned when the form is first rendered.                                                | ❌       |
| `required`         | Marks the field as mandatory for submission.                                                               | ❌       |
| `placeholder`      | Hint text shown inside the input when it's empty.                                                          | ❌       |
| `disabled`         | Whether the field starts as disabled and not editable by the user.                                         | ❌       |
| `options`          | An array of `{ label, value }` pairs used for select, radio, or similar field types.                       | ❌       |
| `metadata`         | Additional metadata for the field, such as validation rules or custom properties.                          | ❌       |
| `wrapperClassName` | A custom class name for the field wrapper, allowing for custom styling.                                    | ❌       |
| `inputClassName`   | A custom class name for the field element itself, allowing for custom styling.                             | ❌       |
| `type`             | Defines the field's type (e.g., `"text"`, `"number"`, `"select"`), which maps to the registered component. | ✅       |

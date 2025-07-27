---
sidebar_position: 1
---

# Register

When you register a field in `react-form-krafter`, it comes with a set of properties and methods that allow you to manage its behavior and state effectively.

## Configuration Properties

These are static — defined when you register the field. They help set up the field's initial state and behavior:

- **`name`**: A unique identifier for the field.
- **`label`**: Text label displayed alongside the field in the UI.
- **`initialValue`**: The default value assigned when the form is first rendered.
- **`required`**: Marks the field as mandatory for submission.
- **`placeholder`**: Hint text shown inside the input when it's empty.
- **`disabled`**: Whether the field is disabled and not editable by the user.
- **`options`**: An array of `{ label, value }` pairs used for select, radio, or similar field types.
- **`type`**: Defines the field's type (e.g., `"text"`, `"number"`, `"select"`), which maps to the registered component.

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

## Settings

You can register settings that will affect all fields.

```jsx title="src/components/fields/register.jsx"
import { Register } from "react-form-krafter";

const updateDebounce = 300;

const COMPONENTS: RegisterComponent<FieldsValue>[] = [
  {
    type: "text",
    render: lazy(() => import("./components/text")),
  },
  {
    type: "number",
    render: lazy(() => import("./components/number")),
  },
];

return (
  <Register components={COMPONENTS} settings={{ updateDebounce }}>
    {/* Your form components */}
  </Register>
);
```
The settings can include:
- **`updateDebounce`**: Time in milliseconds to debounce field updates, if not set, it will update when the user blurs the field.

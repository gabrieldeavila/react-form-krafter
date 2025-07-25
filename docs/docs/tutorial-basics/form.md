---
sidebar_position: 2
---

# Form

Forms are where the registered fields come together to create a user interface for data input.

The following steps show all the available options the form component provides.

```jsx title="src/components/fields/FieldBase.jsx"
const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  age: z
    .number()
    .min(18, "Age must be at least 18")
    .max(100, "Age must be less than 100"),
});


<Form
  formClassName="fields"
  schema={schema}
  formApi={formApi}
  fields={BASIC_FIELDS_EXAMPLE}
  initialDisabledFields={["age"]} // Example of setting initial disabled fields
  onSubmit={async (values) => {
    // Handle form submission
  }}
>
  {(formValue) => (
    <>
      <div className="fields">
        {formValue.fields.map((field) => (
          <FieldBase key={field.name} field={field} />
        ))}
      </div>
      <button type="button" onClick={() => formValue.reset()}>
        Reset
      </button>

      <button type="submit">Submit</button>
    </>
  )}
</Form>
```
## Key Difference from Other Libraries

Unlike many other form libraries, you don't need to create a custom component for each field.

Instead, simply pass the `fields` prop with your registered fields.  

It will automatically render the appropriate component based on the `type` property.

This significantly reduces boilerplate and speeds up development.

You can also include additional components inside the form — such as a submit button, reset button, or custom actions — by placing them alongside the `Form` component.

## Base Properties
- **`formClassName`**: A custom class name for the form element.
- **`schema`**: A validation schema (e.g., using `zod`) to validate the form data. It's not mandatory, but highly recommended.
- **`formApi`**: A reference to the form API, allowing you to programmatically control the form (e.g., reset, submit).
- **`fields`**: An array of registered fields to be rendered in the form.
- **`onSubmit`**: A callback function that is called when the form is submitted.
- **`children`**: A function that receives the current form state and allows you to render additional components or information based on the form's state.
- **`initialDisabledFields`**: An array of field names that should be disabled when the form is first rendered. This allows you to control which fields are editable at the start.

### Form API Methods

| Name                             | Description |
|----------------------------------|-------------|
| **`reset()`**                    | Resets the form to its initial state. |
| **`onFormSubmit()`**             | Programmatically submits the form. Useful for triggering submission from outside the form component. |
| **`setFieldValue(name, value)`** | Updates the value of a specific field by its name. |
| **`setDisabled(name, disabled)`**| Enables or disables a specific field by its name. |
| **`setError(name, error)`**      | Sets an error message for a specific field by its name. |
| **`fieldsState`**                | An object containing the current state of all fields (e.g., value, error, touched, etc.). |
| **`isSubmitting`**               | Boolean indicating whether the form is currently being submitted. |
| **`didSubmitOnce`**              | Boolean indicating whether the form has been submitted at least once. Useful for controlling UI behavior based on submission state. |
| **`fieldsInfo`**                 | An object containing metadata about all fields. See subfields below: |
| &nbsp;&nbsp;&nbsp;&nbsp;`touched`      | Array of field names that have been touched (focused and blurred). |
| &nbsp;&nbsp;&nbsp;&nbsp;`focused`      | Array of field names currently focused. |
| &nbsp;&nbsp;&nbsp;&nbsp;`dirty`        | Array of field names that have been modified. |
| &nbsp;&nbsp;&nbsp;&nbsp;`blurred`      | Array of field names that lost focus at least once. |
| &nbsp;&nbsp;&nbsp;&nbsp;`error`        | Object mapping field names to their respective error messages. |
| &nbsp;&nbsp;&nbsp;&nbsp;`disabled`     | Array of field names currently disabled. |
| &nbsp;&nbsp;&nbsp;&nbsp;`previousState`| Object containing the previous values of all fields. |
| &nbsp;&nbsp;&nbsp;&nbsp;`initialState` | Object containing the initial values of all fields (used when resetting). |
| **`setFieldsInfo(fieldsInfo)`**        | Updates metadata for all fields at once. |
| **`updateFieldsState(fieldsState)`**   | Updates the state of multiple fields. Recommended for batch updates (e.g., value, touched, error, etc.). |
| **`setFieldsState(fieldsState)`**      | Directly sets the full state of all fields. Not recommended — prefer `setFieldValue` or `updateFieldsState`. |

### useForm hook
It shares the same values as the `FormApi` but can only be used inside the `Form` component.

```jsx title="src/hooks/useForm.jsx"
import { useForm } from "react-form-krafter";

const MyComponent = () => {
  const formApi = useForm();

  return (
    <div>
      <button onClick={() => formApi.reset()}>Reset Form</button>
      <pre>{JSON.stringify(formApi.fieldsState, null, 2)}</pre>
    </div>
  );
};
```

### onSubmit Callback
The `onSubmit` callback receives an object with the following properties:
- **`success`**: A boolean indicating whether the form submission was successful.
- **`state`**: An object containing the current values of all fields.
- **`errors`**: An object containing error messages for each field, if any.

### onChange Callback
The `onChange` callback is triggered whenever a field's value changes. It receives an object with the following properties:

- **`fieldName`**: The name of the field that changed.
- **`value`**: The new value of the field.
- **`previousState`**: The previous state of the field before the change.
- **`currentState`**: The current state of the field after the change.

### onUpdate Callback
The `onUpdate` callback is triggered whenever the form's state is updated. 

A update can occur due to a field blur or if you set a default updateDebounce on the `Register` component.

So it will happen after the `onChange` callback.

It receives an object with the following properties:

- **`fieldName`**: The name of the field that was updated.
- **`value`**: The new value of the field.
- **`previousState`**: The previous state of the field before the update.
- **`currentState`**: The current state of the field after the update.

You might return some additional properties in the `onUpdate` callback:
- **`preventUpdate`**: If set to `true`, prevents the form from updating the field's state. This is useful for custom validation or conditional logic that should prevent the update. The state will go back to the previous state (before the change).
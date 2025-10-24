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
</Form>;
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
- **`loaderFallback`**: A fallback component to display while the fields are being loaded.
- **`fieldWrapper`**: A function that wraps each field component. This is useful for adding custom wrappers or async loading states. For example, you can use React's `Suspense` to show a loading indicator while a field component is being loaded asynchronously:

  ```tsx
  fieldWrapper={(fieldComp, fieldProps) => (
    <Suspense
      fallback={
        <div className={fieldProps.wrapperClassName}>
          Loading {fieldProps.label}...
        </div>
      }
    >
      {fieldComp}
    </Suspense>
  )}
  ```

- **`forceFieldChangeState`**: An object that forces a rerender of the fields with the given state. This is useful for controlled components outside the form's context.

### Form API Methods

The form exposes a programmatic API via the `formApi` ref. Below are the methods and properties available on that API (see `src/types/form.types.ts` for types):

| Name | Description |
| ---- | ----------- |
| `reset()` | Reset all fields to the form initial state. |
| `updateFieldsState(newState)` | Merge `newState` into the current fields state (batch updates). |
| `setFieldsState(state)` | Replace the full fields state (React setState signature). |
| `setFieldsInfo(fieldsInfo)` | Replace the full fields info (React setState signature). |
| `setDisabled(fieldName, disabled)` | Enable/disable a field programmatically. |
| `setError(fieldName, error)` | Set or clear a manual error for a field. Pass `null` to clear. |
| `setFieldValue(fieldName, value)` | Set a single field's value programmatically. |
| `setDidSubmitOnce(value)` | Set the internal `didSubmitOnce` flag. |
| `checkForErrors()` | Run validation against the form schema and update errors; returns `{ hasError: boolean }`. |
| `requestSubmit()` | Programmatically trigger a submit on the internal form element. |
| `formRef` | `RefObject<HTMLFormElement>` — the internal form element ref (useful for advanced integrations). |
| `fieldsState` | Current form values object. |
| `isSubmitting` | Boolean: form is currently submitting. |
| `didSubmitOnce` | Boolean: form has been submitted at least once. |
| `hasSomeError` | Boolean: any field currently reports an error (including manual errors). |
| `fieldsInfo` | Full `FieldsInfo<T>` structure with `dirty`, `focused`, `touched`, `blurred`, `previousState`, `initialState`, `errors`, and `manualErrors`. |

Notes:

- `checkForErrors()` updates `fieldsInfo.errors` and `fieldsInfo.manualErrors` and returns an object `{ hasError }` describing whether any validation errors were found.
- Prefer `setFieldValue` or `updateFieldsState` for typical updates; `setFieldsState` replaces the entire state and should be used with care.

### formApi

The `formApi` prop is a ref that provides access to the Form API methods and properties.
To use it, create a ref using `useRef` and pass it to the `formApi` prop.

```jsx title="src/components/fields/FieldBase.jsx"
const formApi = useRef(null);
return (
  <div className="example-wrapper">
    <Register components={COMPONENTS}>
      <Form
        formClassName="fields"
        schema={schema}
        formApi={formApi}
        fields={BASIC_FIELDS_EXAMPLE}
      >
        <button type="submit">Submit</button>
      </Form>
    </Register>
  </div>
);
```

### Loader Fallback

The `loaderFallback` prop allows you to define a fallback component while the fields are being loaded. This is useful for displaying a loading spinner or placeholder content.

If you provide a function, it will receive the field as an argument, allowing you to customize the fallback based on the field's properties.

```jsx title="src/components/fields/FieldBase.jsx"
const LoaderFallback = useCallback(({ field }) => {
  return <div>Loading {field.name}...</div>;
}, []); // Memoized to avoid unnecessary re-renders

<Form
  formClassName="fields"
  schema={schema}
  formApi={formApi}
  fields={BASIC_FIELDS_EXAMPLE}
  initialDisabledFields={["age"]} // Example of setting initial disabled fields
  onSubmit={async (values) => {
    // Handle form submission
  }}
  loaderFallback={LoaderFallback}
>
  // Custom loader fallback
</Form>;
```

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

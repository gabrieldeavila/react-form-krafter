# Get Started

React Form Krafter - A flexible form engine for React.

## Installation

It's easy to get started with `react-form-krafter`.

Only install the package using npm or your preferred package manager:

```bash
npm install react-form-krafter
```

## What is Krafter?

`react-form-krafter` is built to streamline form development in React applications.

Our core idea is **reusability**.  
You define your form fields once — and use them anywhere.

Whether you're building complex flows or simple forms, Krafter lets you:

- **Register once, reuse everywhere** – no need to repeat validation or field logic.
- **Customize easily** – override behavior by passing props when needed.
- **Stay consistent** – ensure all forms across your app share the same foundation.

Krafter offers a standardized approach to form construction, helping you scale your UI without repetitive code.

## Basic Usage

### Registering Fields

By registering fields, you can create reusable components that can be used across your application.

We recommend creating each field as a separate component.

So your folder structure might look like this:

```
src/
  components/
      fields/
        TextField.jsx
        NumberField.jsx
        FieldBase.jsx
        register.jsx
```

One example of a field component is `FieldBase.jsx`:

```jsx title="src/components/fields/FieldBase.jsx"
import type { FieldMethods, RegisterField } from "react-form-krafter";
import { memo } from "react";

const FieldBase = memo(({ methods, field, type, onFieldChange }) => {
  return (
    <div className="field-wrapper">
      <label htmlFor={field.name}>{field.label}</label>

      <input
        type={type}
        placeholder={field.placeholder}
        id={field.name}
        name={field.name}
        required={field.required}
        disabled={field.isDisabled}
        value={
          type === "number"
            ? Number(field.value)
            : typeof field.value === "string"
            ? field.value
            : ""
        }
        defaultValue={
          type === "number"
            ? Number(field.initialValue)
            : String(field.initialValue)
        }
        onChange={(e) => methods.onChange(onFieldChange(e.target.value))}
        onBlur={methods.onBlur}
      />

      {field.error && field.isErrorVisible && (
        <span className="error">{field.error}</span>
      )}
    </div>
  );
});

export default FieldBase;
```

This component is a base for all fields, handling common properties like `label`, `placeholder`, and `value`. It also manages the input's state and validation.

You can then create specific field components like `TextField.jsx` or `NumberField.jsx` that extend this base component.

```jsx title="src/components/fields/TextField.jsx"
import FieldBase from "./FieldBase";

const TextField = (props) => {
  return <FieldBase {...props} type="text" />;
};

export default TextField;
```

Before using your fields, you need to register them.

We recommend creating a `registerFields.tsx` (or `.jsx`) file where you define all your form fields in one place. Then, wrap this registration logic in your root component, such as `App`.

For better performance, you can use **lazy loading** to register fields only when necessary.

Here’s a basic structure:

```jsx title="src/components/fields/registerFields.jsx"
import Register from "react-form-krafter";

const COMPONENTS = [
  {
    type: "text",
    render: lazy(() => import("./TextField")),
  },
  {
    type: "number",
    render: lazy(() => import("./NumberField")),
  },
];

const App = () => {
  return (
    <Register components={COMPONENTS}>{/* Your app components */}</Register>
  );
};
export default App;
```

### Creating a Form

Now that your fields are registered, you can create a form using those components.

To do this, define the fields you want to use in your form.  
We recommend following the structure below:

```jsx title="src/pages/FirstForm/fields.js"
export const BASIC_FIELDS_EXAMPLE = [
  {
    name: "name",
    label: "Name Field",
    placeholder: "Enter name",
    required: true,
    disabled: false,
    type: "text",
    initialValue: "",
  },
  {
    name: "age",
    label: "Age Field",
    placeholder: "Enter age",
    required: true,
    disabled: false,
    type: "number",
    initialValue: 0,
  },
];
```

Import your field definitions and render the form using the `Form` component from `react-form-krafter`.

You can use any validation library, but `zod` pairs especially well for schema-based validation.

```jsx title="src/pages/FirstForm/index.jsx"
import { Form } from "react-form-krafter";
import { BASIC_FIELDS_EXAMPLE } from "./fields";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Age must be a positive number"),
});

const FirstForm = () => {
  const formApi = useRef(null);

    return (
      <Form
        fields={BASIC_FIELDS_EXAMPLE}
        schema={schema}
        formApi={formApi}
        onSubmit={async (values) => {
          if (values.success) {
            alert("Form submitted successfully!");
          } else {
            alert("Form submission failed. Check errors.");
          }
          console.log("Form submitted:", values);
        }}
      >
      {(formValue) => (
        <div>
          <div className="flex gap-2">
            <button type="submit">Submit</button>
            <button type="button" onClick={() => formApi.current?.reset()}>
              Reset
            </button>
          </div>

          <h2>Current State:</h2>
          <pre>{JSON.stringify(formValue.fieldsState, null, 2)}</pre>
        </div>
      )}
    </Form>
  );
};

export default FirstForm;
```

The `formApi` ref allows you to access methods like `reset()` and `requestSubmit()` (and others described in the docs), giving you programmatic control over the form's state and behavior.

Also, you are able to access the current state of the form through `formValue.fieldsState`, which provides insights into the values and validation status of each field.

If you add a child component to the form, you will be able to access the same values provided by the `Form` component, allowing you to create more complex interactions or display additional information based on the form state.

## Learn more
To dive deeper into `react-form-krafter`, read our official documentation [here](https://react-form-krafter.vercel.app/docs/category/basics).
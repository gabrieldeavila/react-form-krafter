---
sidebar_position: 1
---

# Register

When you register a field in `react-form-krafter`, it comes with a set of properties and methods that allow you to manage its behavior and state effectively.

## Settings

You can register settings that will affect all fields.

```jsx title="src/components/fields/register.jsx"
import { Register } from "react-form-krafter";

const updateDebounce = 300;
const labels = {
  required: "This field is required",
};

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
  <Register components={COMPONENTS} settings={{ updateDebounce, labels }}>
    {/* Your form components */}
  </Register>
);
```

The settings can include:

- **`updateDebounce`**: Time in milliseconds to debounce field updates, if not set, it will update when the user blurs the field.
- **`labels`**: An object containing default labels for fields, which can be overridden by individual field configurations.
  - **`required`**: Error message displayed when a required field is not filled out.
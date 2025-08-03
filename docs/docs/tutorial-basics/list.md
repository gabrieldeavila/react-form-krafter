---
sidebar_position: 5
---

# List

Lists are a powerful feature in `react-form-krafter` that allow you to manage collections of items with ease. They provide a structured way to handle dynamic data inputs, such as adding or removing items from a list.

The `List` component is designed to work seamlessly with `Form` and `Register`, allowing you to build complex, dynamic forms with repeating sections.

```tsx title="src/components/list/ExampleV0List.tsx"
import { List } from "@lib/list";
import Register from "@lib/register/registerContext";
import type {
  ListAddRowComponentProps,
  ListApi,
  ListItemRowComponentProps,
  RegisterComponent,
  RegisterFieldRenderProps,
} from "@lib/types";
import { lazy, useCallback, useRef, type ComponentType } from "react";
import { z } from "zod";
import { BASIC_FIELDS_EXAMPLE } from "./fields";

type FieldsValue = number | string;

const COMPONENTS: RegisterComponent<FieldsValue>[] = [
  {
    type: "text",
    render: lazy(() => import("./components/text")) as ComponentType<
      RegisterFieldRenderProps<FieldsValue>
    >,
  },
  {
    type: "number",
    render: lazy(() => import("./components/number")) as ComponentType<
      RegisterFieldRenderProps<FieldsValue>
    >,
  },
];

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  surname: z.string().min(3, "Surname must be at least 3 characters long"),
  age: z
    .number()
    .min(18, "Age must be at least 18")
    .max(100, "Age must be less than 100"),
  about: z.string().max(500, "About must be less than 500 characters"),
});

type Schema = typeof schema;
type Validator = z.infer<Schema>;

function ExampleV0List() {
  const listApi = useRef<ListApi<Validator> | null>(null);

  const addRowComponent = useCallback(
    ({ add, form }: ListAddRowComponentProps<Validator>) => (
      <div>
        {form}
        <button onClick={add}>Add Row</button>
      </div>
    ),
    []
  );

  const itemRowComponent = useCallback(
    ({ index, remove, form }: ListItemRowComponentProps<Validator>) => (
      <div className="item-row">
        {form}
        <button onClick={() => remove(index)}>Remove Row</button>
      </div>
    ),
    []
  );

  return (
    <div className="example-wrapper">
      <Register<FieldsValue> components={COMPONENTS}>
        <List<Validator, Schema>
          listApi={listApi}
          itemsProps={{
            rowComponent: itemRowComponent,
            onUpdate: async ({ item, index, currentState }) => {
              console.log("Item updated:", item, "at index:", index);
              console.log("Current state:", currentState);

              const fakeDelay = (ms: number) =>
                new Promise((resolve) => setTimeout(resolve, ms));

              await fakeDelay(1000); // Simulate a delay for the update

              if (currentState.age < 18) {
                return {
                  preventUpdate: true,
                };
              }
            },
          }}
          addProps={{
            rowComponent: addRowComponent,
            onError: (error) => {
              console.error("Error adding item:", error);
            },
            onSuccess: (item) => {
              console.log("Item added successfully:", item);
            },
          }}
          schema={schema}
          fields={BASIC_FIELDS_EXAMPLE}
          formProps={{
            formClassName: "fields",
          }}
        />
      </Register>
    </div>
  );
}

export default ExampleV0List;
```

## Base Properties

- **`fields`**: An array of registered fields to be rendered for each item in the list.
- **`schema`**: A validation schema (e.g., using `zod`) to validate the form data for each item.
- **`listApi`**: A ref to the list API, allowing you to programmatically control the list (e.g., add, remove, update items).
- **`initialItems`**: An array of initial items to populate the list.
- **`formProps`**: Props to be passed to the underlying `Form` components.
  - **`formClassName`**: A custom class name for the form elements.
- **`children`**: A function that receives the `listApi` and allows you to render additional components.

## `addProps`

The `addProps` prop configures the component for adding new items to the list.

- **`rowComponent`**: A component that renders the UI for adding a new item. It receives the following props:
  - **`add`**: A function to call when the user wants to add the item.
  - **`form`**: The `Form` component to be rendered for the new item.
  - **`formApi`**: The API for the "add row" form.
- **`onSuccess`**: A callback function that is called when a new item is successfully validated and added. It receives the new item as an argument. You can return a modified item to be added to the list.
- **`onError`**: A callback function that is called when adding a new item fails validation. It receives the validation errors.

## `itemsProps`

The `itemsProps` prop configures the component for rendering and managing existing items in the list.

- **`rowComponent`**: A component that renders the UI for each item in the list. It receives the following props:
  - **`item`**: The data for the current item.
  - **`index`**: The index of the current item in the list.
  - **`remove`**: A function to call to remove the item from the list.
  - **`form`**: The `Form` component for the current item.
  - **`formApi`**: The API for the item's form.
- **`onChange`**: A callback that is triggered whenever a field's value changes in any of the item forms. It receives an object with details about the change, including `fieldName`, `value`, `item`, and `index`.
- **`onUpdate`**: A callback that is triggered whenever an item's form state is updated (e.g., on blur). It receives an object with details about the update. You can return `{ preventUpdate: true }` to prevent the state change.

## List API Methods

The `listApi` ref provides access to the following methods and properties:

| Name | Description |
| :--- | :--- |
| **`items`** | An array containing the current state of all items in the list. |
| **`addItem()`** | Programmatically adds a new item to the list. It triggers validation on the "add row" form. |
| **`removeItem(index)`** | Removes the item at the specified index from the list. |
| **`updateItem(index, item)`** | Updates the item at the specified index with new data. |

You can also use a render prop `children` to get access to the `listApi`:

```jsx
<List {...props}>
  {(listApi) => (
    <div>
      <button onClick={() => listApi.addItem()}>Add from outside</button>
    </div>
  )}
</List>
```

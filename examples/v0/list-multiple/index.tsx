import { List } from "@lib/list";
import Register from "@lib/register/registerContext";
import type {
  ListAddRowComponentProps,
  ListApi,
  ListItemRowComponentProps,
  RegisterComponent,
  RegisterFieldRenderProps,
} from "@lib/types";
import { lazy, Suspense, useCallback, useRef, type ComponentType } from "react";
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

const initialItems: Validator[] = [
  { name: "John", surname: "Doe", age: 30, about: "A software engineer" },
  { name: "Jane", surname: "Doe", age: 25, about: "A product manager" },
];

function ExampleV0ListMultiple() {
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

  const handleInsert = () => {
    console.log(listApi.current);

    listApi.current?.insertItems([
      { name: "New", surname: "Person", age: 21, about: "New entry" },
      { name: "Another", surname: "One", age: 45, about: "Another new entry" },
    ]);
  };

  const handleRemove = () => {
    listApi.current?.removeItems([0, 2]);
  };

  const handleUpdate = () => {
    listApi.current?.updateItems([
      {
        index: 1,
        item: {
          name: "Updated",
          surname: "Jane",
          age: 26,
          about: "Updated info",
        },
      },
    ]);
  };

  return (
    <div className="example-wrapper">
      <div className="button-group">
        <button onClick={handleInsert}>Insert Multiple</button>
        <button onClick={handleRemove}>Remove Multiple</button>
        <button onClick={handleUpdate}>Update Multiple</button>
      </div>
      <Register<FieldsValue> components={COMPONENTS}>
        <List<Validator, Schema>
          listApi={listApi}
          initialItems={initialItems}
          itemsProps={{
            rowComponent: itemRowComponent,
          }}
          formProps={{
            formClassName: "list-form",
            fieldWrapper: (fieldComp, fieldProps) => (
              <Suspense
                fallback={
                  <div className={fieldProps.wrapperClassName}>Loading...</div>
                }
              >
                {fieldComp}
              </Suspense>
            ),
          }}
          addProps={{
            rowComponent: addRowComponent,
          }}
          schema={schema}
          fields={BASIC_FIELDS_EXAMPLE}
        />
      </Register>
    </div>
  );
}

export default ExampleV0ListMultiple;

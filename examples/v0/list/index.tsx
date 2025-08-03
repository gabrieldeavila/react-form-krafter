import { List } from "@lib/list";
import Register from "@lib/register/registerContext";
import type {
  ListAddRowComponentProps,
  ListApi,
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
    ({ onAdd, form }: ListAddRowComponentProps<Validator>) => (
      <div>
        {form}

        <button onClick={onAdd}>Add Row</button>
      </div>
    ),
    []
  );

  return (
    <div className="example-wrapper">
      <Register<FieldsValue> components={COMPONENTS}>
        <List<Validator, Schema>
          listApi={listApi}
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

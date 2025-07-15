import { lazy, useRef, type ComponentType } from "react";
import { z } from "zod";
import Form from "@lib/form/formContext";
import Register from "@lib/register/registerContext";
import type {
  FormApi,
  RegisterComponent,
  RegisterFieldRenderProps,
} from "@lib/types";
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
  text: z.string().min(3, "Text must be at least 3 characters long"),
  age: z
    .number()
    .min(18, "Age must be at least 18")
    .max(100, "Age must be less than 100"),
});

type Schema = typeof schema;
type Validator = z.infer<Schema>;

function ExampleV1Basic() {
  const formApi = useRef<FormApi<Validator> | null>(null);

  return (
    <Register<FieldsValue>
      components={COMPONENTS}
      settings={{
        updateDebounce: 300, // Example debounce setting
      }}
    >
      <Form<Validator, Schema>
        schema={schema}
        formApi={formApi}
        fields={BASIC_FIELDS_EXAMPLE}
        onUpdate={async ({ fieldName, value }) => {
          if (fieldName === "text" && typeof value === "string") {
            if (value.length > 3) {
              formApi.current?.setDisabled("age", true);
              formApi.current?.setError("age", "Age cannot be set when text is longer than 3 characters");
              return { preventUpdate: true }; // Example of preventing the update
            }

            formApi.current?.setDisabled("age", false);
          }
        }}
      >
        {(formValue) => (
          <div>
            <h1>Basic Form Example</h1>
            <pre>{JSON.stringify(formValue.fieldsState, null, 2)}</pre>
          </div>
        )}
      </Form>
    </Register>
  );
}

export default ExampleV1Basic;

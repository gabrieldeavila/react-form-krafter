import { lazy, useRef } from "react";
import { z } from "zod";
import Form from "../../../form/formContext";
import Register from "../../../register/registerContext";
import type { FormApi, RegisterComponent } from "../../../types";
import { BASIC_FIELDS_EXAMPLE } from "./fields";

const COMPONENTS: RegisterComponent[] = [
  {
    type: "text",
    render: lazy(() => import("./components/text")),
  },
  {
    type: "number",
    render: lazy(() => import("./components/number")),
  },
];

const schema = z.object({
  text: z.string().min(3, "Text must be at least 3 characters long"),
  age: z.number().min(18, "Age must be at least 18"),
});

type Schema = typeof schema;
type Validator = z.infer<Schema>;

function ExampleV1Basic() {
  const formApi = useRef<FormApi<Validator> | null>(null);

  return (
    <Register
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
          if (
            fieldName === "text" &&
            typeof value === "string" &&
            value.length > 3
          ) {
            return { preventUpdate: true }; // Example of preventing the update
          }
        }}
        onChange={async ({ fieldName, updateFieldsState }) => {
          if (fieldName === "age") {
            updateFieldsState({ age: 30 }); // Example of updating state
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

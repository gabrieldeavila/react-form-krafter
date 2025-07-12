import { lazy, useRef } from "react";
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

function ExampleV1Basic() {
  const formApi = useRef<FormApi>(null);

  return (
    <Register
      components={COMPONENTS}
      settings={{
        updateDebounce: 300, // Example debounce setting
      }}
    >
      <Form
        formApi={formApi}
        fields={BASIC_FIELDS_EXAMPLE}
        onUpdate={async ({ fieldName, value }) => {
          if (fieldName === "text" && (value as string).length > 3) {
            return { preventUpdate: true }; // Example of preventing the update
          }
        }}
        onChange={({ fieldName, updateFieldsState }) => {
          if (fieldName === "number") {
            updateFieldsState({ text: "..." }); // Example of updating state
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

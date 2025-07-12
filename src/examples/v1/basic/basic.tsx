import { lazy } from "react";
import Form from "../../../form/formContext";
import Register from "../../../register/registerContext";
import type { RegisterComponent } from "../../../types";
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
  return (
    <Register
      components={COMPONENTS}
      settings={{
        updateDebounce: 300, // Example debounce setting
      }}
    >
      <Form
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
      />
    </Register>
  );
}

export default ExampleV1Basic;

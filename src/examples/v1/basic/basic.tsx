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
    <Register components={COMPONENTS}>
      <Form fields={BASIC_FIELDS_EXAMPLE} />
    </Register>
  );
}

export default ExampleV1Basic;

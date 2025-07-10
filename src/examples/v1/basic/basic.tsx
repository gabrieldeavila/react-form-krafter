import { lazy } from "react";
import Form from "../../../form/formContext";
import Register from "../../../register/registerContext";
import { BASIC_FIELDS_EXAMPLE } from "./fields";

function ExampleV1Basic() {
  return (
    <Register
      components={[
        {
          type: "text",
          render: lazy(() => import("./components/text")),
        },
      ]}
    >
      <Form fields={BASIC_FIELDS_EXAMPLE} />
    </Register>
  );
}

export default ExampleV1Basic;

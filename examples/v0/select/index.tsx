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
  {
    type: "select",
    render: lazy(() => import("./components/select")) as ComponentType<
      RegisterFieldRenderProps<FieldsValue>
    >,
  },
];

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  country: z.string(),
  city: z.string()
});

type Schema = typeof schema;
type Validator = z.infer<Schema>;

function ExampleV0BasicAsync() {
  const formApi = useRef<FormApi<Validator> | null>(null);

  return (
    <div className="example-wrapper">
      <Register<FieldsValue> components={COMPONENTS}>
        <Form<Validator, Schema>
          formClassName="fields"
          schema={schema}
          formApi={formApi}
          fields={BASIC_FIELDS_EXAMPLE}
          onChange={({ fieldName }) => {
            if (fieldName === "country") {
              formApi.current?.setFieldValue("city", "");
            }
          }}
          onSubmit={async (values) => {
            if (values.success) {
              alert("Form submitted successfully!");
            } else {
              alert("Form submission failed. Check errors.");
            }
            console.log("Form submitted:", values);
          }}
        >
          {(formValue) => (
            <div>
              <div className="flex gap-2">
                <button type="submit" disabled={formValue.isSubmitting}>
                  {formValue.isSubmitting ? "Submitting..." : "Submit"}
                </button>
                <button type="button" onClick={() => formApi.current?.reset()}>
                  Reset
                </button>
              </div>

              <h2>Current State:</h2>
              <pre>{JSON.stringify(formValue.fieldsState, null, 2)}</pre>
            </div>
          )}
        </Form>
      </Register>
    </div>
  );
}

export default ExampleV0BasicAsync;

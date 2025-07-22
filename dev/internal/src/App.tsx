import { lazy, useRef, useState, type ComponentType } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import type {
  FormApi,
  RegisterComponent,
  RegisterFieldRenderProps,
} from "react-form-krafter";
import { Register, Form } from "react-form-krafter";
import z from "zod";
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

function App() {
  const [count, setCount] = useState(0);
  const formApi = useRef<FormApi<Validator> | null>(null);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Register<FieldsValue> components={COMPONENTS}>
          <Form<Validator, Schema>
            formClassName="fields"
            schema={schema}
            formApi={formApi}
            fields={BASIC_FIELDS_EXAMPLE}
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
                  <button type="submit">Submit</button>
                  <button
                    type="button"
                    onClick={() => formApi.current?.reset()}
                  >
                    Reset
                  </button>
                </div>

                <h2>Current State:</h2>
                <pre>{JSON.stringify(formValue.fieldsState, null, 2)}</pre>
              </div>
            )}
          </Form>
        </Register>

        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

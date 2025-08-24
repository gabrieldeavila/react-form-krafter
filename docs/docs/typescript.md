---
sidebar_position: 4
---

# Typescript usage

This is a cheatsheet for using `react-form-krafter` with Typescript.

## Register

```tsx title="src/components/fields/Register.tsx"
import { lazy, type ComponentType } from "react";
import {
  Register,
  type RegisterComponent,
  type RegisterFieldRenderProps,
  type RegisterSettings,
} from "react-form-krafter";

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

const settings: RegisterSettings = {
  labels: {
    required: "This field is required",
  },
};

function KrafterRegister({ children }: { children: React.ReactNode }) {
  return (
    <Register<FieldsValue> components={COMPONENTS} settings={settings}>
      {children}
    </Register>
  );
}
```

## Form

```tsx title="src/components/fields/Form.tsx"
import { useRef } from "react";
import { Form, type Field, type FormApi } from "react-form-krafter";
import z from "zod";
import KrafterRegister from "~/components/internal/krafter/register";
import { Button } from "~/components/ui/button";

const SIGNUP_FIELDS: Field[] = [
  {
    name: "email",
    label: "email.label",
    placeholder: "email.placeholder",
    required: true,
    disabled: false,
    type: "email",
    initialValue: "",
    wrapperClassName: "grid gap-3",
  },
  {
    name: "password",
    label: "password.label",
    placeholder: "password.placeholder",
    required: true,
    disabled: false,
    type: "password",
    initialValue: "",
    wrapperClassName: "grid gap-3",
  },
  {
    name: "confirm_password",
    label: "confirm_password.label",
    placeholder: "confirm_password.placeholder",
    required: true,
    disabled: false,
    type: "password",
    initialValue: "",
    wrapperClassName: "grid gap-3",
  },
];

const schema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(6),
  confirm_password: z.string().min(6),
});

type Schema = typeof schema;
type Validator = z.infer<Schema>;

function SignUp({ className, ...props }: React.ComponentProps<"div">) {
  const formApi = useRef<FormApi<Validator> | null>(null);

  return (
    <KrafterRegister>
      <Form<Validator, Schema>
        formClassName="flex flex-col gap-6"
        fields={SIGNUP_FIELDS}
        schema={schema}
        formApi={formApi}
        onSubmit={async (data) => {
          console.log(
            data,
            formApi.current?.fieldsInfo,
            formApi.current?.fieldsInfo.errors
          );

          if (data.success) {
            // Handle successful submission
          } else {
            // Handle failed submission
          }
        }}
        onUpdate={(data) => {
          if (formApi.current === null) return;

          if (["password", "confirm_password"].includes(data.fieldName)) {
            const isValid =
              data.currentState.confirm_password === data.currentState.password;

            formApi.current.setError(
              "confirm_password",
              isValid ? null : "Passwords do not match"
            );
          }
        }}
      >
        <div className="flex flex-col gap-3">
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    </KrafterRegister>
  );
}
```

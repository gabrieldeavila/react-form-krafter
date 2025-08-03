import { memo, useCallback, useRef } from "react";
import {
  Form,
  List,
  useFieldsErrors,
  useFieldsState,
  useListApi,
  type Field,
  type ListAddRowComponentProps,
  type ListApi,
  type ListItemRowComponentProps,
} from "react-form-krafter";
import { z } from "zod";
import KrafterRegister from "~/components/internal/krafter/register";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  // surname: z.string().min(3, "Surname must be at least 3 characters long"),
  age: z
    .number()
    .min(18, "Age must be at least 18")
    .max(100, "Age must be less than 100"),
  birthDate: z
    .date()
    .refine(
      (date) => date instanceof Date && !isNaN(date.getTime()),
      "Invalid date"
    )
    // .max(new Date(), "Date cannot be in the future")
    .refine((date) => date <= new Date(), "Date cannot be in the future"),
  // about: z.string().max(500, "About must be less than 500 characters"),
});

type Schema = typeof schema;
type Validator = z.infer<Schema>;

const fields: Field[] = [
  {
    name: "name",
    label: "Name",
    placeholder: "Enter a name",
    required: true,
    disabled: false,
    type: "text",
  },
  {
    name: "age",
    label: "Age",
    placeholder: "Enter age",
    required: true,
    disabled: false,
    type: "number",
  },
  {
    name: "birthDate",
    label: "Birth Date",
    required: true,
    disabled: false,
    type: "date",
  },
  {
    name: "favoriteLanguage",
    label: "Favorite Language",
    placeholder: "Select your favorite",
    required: true,
    disabled: false,
    type: "select",
    options: [
      { value: "javascript", label: "JavaScript" },
      { value: "typescript", label: "TypeScript" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "csharp", label: "C#" },
      { value: "ruby", label: "Ruby" },
    ],
  },
];

const skillSchema = z.object({
  name: z.string().min(2, "Skill name must be at least 2 characters long"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

type SkillSchema = typeof skillSchema;
type SkillValidator = z.infer<SkillSchema>;

const skillFields: Field[] = [
  {
    name: "name",
    label: "Skill",
    placeholder: "Enter a skill",
    type: "text",
  },
  {
    name: "level",
    label: "Level",
    placeholder: "Select a level",
    type: "select",
    options: [
      { value: "Beginner", label: "Beginner" },
      { value: "Intermediate", label: "Intermediate" },
      { value: "Advanced", label: "Advanced" },
    ],
  },
];

function FormFeatures() {
  const listApi = useRef<ListApi<SkillValidator>>(null);
  const onSubmit = useCallback(
    ({
      errors,
      state,
      success,
    }: {
      state: Validator;
      errors: Record<keyof Validator, string | null>;
      success: boolean;
    }) => {
      if (!success) {
        alert("Form submission failed. Check errors in the console.");
        console.error("Form submission errors:", errors);
        return;
      }

      alert("Form submitted successfully!");
      console.log("Form submitted with values:", state);
    },
    []
  );

  const addRowComponent = useCallback(
    ({ add, form }: ListAddRowComponentProps<SkillValidator>) => (
      <div className="flex items-end gap-4">
        <div className="flex-grow">{form}</div>
        <Button onClick={add}>Add Skill</Button>
      </div>
    ),
    []
  );

  const itemRowComponent = useCallback(
    ({ index, remove, form }: ListItemRowComponentProps<SkillValidator>) => (
      <div className="flex items-end gap-4 mt-2 p-4 border rounded-md">
        <div className="flex-grow">{form}</div>
        <Button variant="destructive" onClick={() => remove(index)}>
          Remove
        </Button>
      </div>
    ),
    []
  );

  return (
    <KrafterRegister>
      <h1 className="text-2xl font-bold mb-4">Form Features Example</h1>
    
      <Form<Validator, Schema>
        formClassName={cn(
          "grid gap-4",
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}
        loaderFallback={
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-12 rounded-md" />
            <Skeleton className="h-12 rounded-md" />
            <Skeleton className="h-12 rounded-md" />
            <Skeleton className="h-12 rounded-md" />
          </div>
        }
        fields={fields}
        schema={schema}
        onSubmit={onSubmit}
      >
        <Submit />

        <FormInfo />
        <FormErrors />
      </Form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Skills List</h2>
        <List<SkillValidator, SkillSchema>
          listApi={listApi}
          fields={skillFields}
          schema={skillSchema}
          addProps={{
            rowComponent: addRowComponent,
          }}
          itemsProps={{
            rowComponent: itemRowComponent,
          }}
          formProps={{
            formClassName: "grid grid-cols-1 md:grid-cols-2 gap-4",
          }}
        >
          <ListInfo />
        </List>
      </div>
    </KrafterRegister>
  );
}

export default FormFeatures;

const ListInfo = memo(() => {
  const { items } = useListApi<SkillValidator>();

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4">
      <h2 className="text-lg font-semibold">List State</h2>
      <p className="text-sm text-muted-foreground">
        <pre>{JSON.stringify(items, null, 2)}</pre>
      </p>
    </div>
  );
});

const FormInfo = memo(() => {
  const fieldsState = useFieldsState<Validator>();

  const cleaned = Object.fromEntries(
    Object.entries(fieldsState).map(([key, value]) => [
      key,
      value === undefined ? "undefined" : value,
    ])
  );

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-4">
      <h2 className="text-lg font-semibold">Form State</h2>
      <p className="text-sm text-muted-foreground">
        <pre>{JSON.stringify(cleaned, null, 2)}</pre>
      </p>
    </div>
  );
});

const FormErrors = memo(() => {
  const fieldsError = useFieldsErrors<Validator>();
  const cleaned = Object.fromEntries(
    Object.entries(fieldsError).map(([key, value]) => [
      key,
      value === "" || value == null ? "No error" : value,
    ])
  );

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-4">
      <h2 className="text-lg font-semibold">Form Errors</h2>
      <p className="text-sm text-destructive">
        <pre>{JSON.stringify(cleaned, null, 2)}</pre>
      </p>
    </div>
  );
});

const Submit = memo(() => {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-4">
      <Button type="submit">Submit</Button>
    </div>
  );
});

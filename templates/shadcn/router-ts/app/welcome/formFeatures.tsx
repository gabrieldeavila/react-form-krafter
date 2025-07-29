import { Form, type Field } from "react-form-krafter";
import KrafterRegister from "~/components/internal/krafter/register";
import { z } from "zod";
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

function FormFeatures() {
  return (
    <KrafterRegister>
      <Form<Validator, Schema>
        formClassName={cn(
          "grid gap-4",
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}
        fields={fields}
        schema={schema}
      >
        {(values) => {
          console.log(
            "Form values:",
            values.fieldsState.birthDate?.toDateString()
          );

          return null;
        }}
      </Form>
    </KrafterRegister>
  );
}

export default FormFeatures;

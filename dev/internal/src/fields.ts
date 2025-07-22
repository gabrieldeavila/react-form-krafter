import type { Field } from "react-form-krafter";

export const BASIC_FIELDS_EXAMPLE: Field[] = [
  {
    name: "name",
    label: "Name Field",
    placeholder: "Enter name",
    required: true,
    disabled: false,
    type: "text",
    initialValue: "",
  },
  {
    name: "surname",
    label: "Surname Field",
    placeholder: "Enter surname",
    required: false,
    disabled: false,
    type: "text",
    initialValue: "",
  },
  {
    name: "age",
    label: "Age Field",
    placeholder: "Enter age",
    required: true,
    disabled: false,
    type: "number",
    initialValue: 10,
  },
  {
    name: "about",
    label: "About Field",
    placeholder: "Tell us about yourself",
    required: false,
    disabled: false,
    type: "text",
    initialValue: "",
  },
];

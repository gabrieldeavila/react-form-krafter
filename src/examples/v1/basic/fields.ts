import type { Field } from "../../../types/field.types";

export const BASIC_FIELDS_EXAMPLE: Field[] = [
  {
    name: "text",
    label: "Text Field",
    placeholder: "Enter text",
    required: true,
    disabled: false,
    type: "text",
    initialValue: "",
  },
  {
    name: "number",
    label: "Number Field",
    placeholder: "Enter number",
    required: true,
    disabled: false,
    type: "number",
    initialValue: 10,
  },
];

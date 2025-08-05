import type { Field } from "@lib/types";

export const BASIC_FIELDS_EXAMPLE: Field[] = [
  {
    name: "name",
    type: "text",
    label: "Name",
    initialValue: "",
  },
  {
    name: "surname",
    type: "text",
    label: "Surname",
    initialValue: "",
  },
  {
    name: "age",
    type: "number",
    label: "Age",
    initialValue: 0,
  },
  {
    name: "about",
    type: "text",
    label: "About",
    initialValue: "",
  },
];

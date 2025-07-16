import type { Field } from "@lib/types/field.types";

export const BASIC_FIELDS_EXAMPLE: Field[] = [
  {
    name: "name",
    label: "Name Field",
    placeholder: "Enter name",
    required: true,
    disabled: false,
    type: "text",
  },
  {
    name: "country",
    label: "Country Field",
    placeholder: "Enter country",
    required: false,
    disabled: false,
    type: "select",
    options: [
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
      { label: "Mexico", value: "mx" },
      { label: "Brazil", value: "br" },
      { label: "Argentina", value: "ar" },
    ],
    initialValue: "br",
  },
  {
    name: "city",
    label: "City Field",
    placeholder: "Enter city",
    required: true,
    disabled: false,
    type: "text",
    initialValue: "Bento Gonçalves",
  },
];

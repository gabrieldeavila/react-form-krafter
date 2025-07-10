import type { Field } from "./field.types";

export type FormContext = Partial<{
  fields: Field[];
}>;

export type FieldMethods = {
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any> | React.KeyboardEvent<any>) => void;
};

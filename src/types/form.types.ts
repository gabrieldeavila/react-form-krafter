import type { Field } from "./field.types";

export type FormUserProps = {
  fields: Field[];
};

export type FormContext = FormUserProps & {
  fieldsState: Record<string, any>;
  setFieldsState: React.Dispatch<React.SetStateAction<Record<string, any>>>;

  fieldsInfo: FieldsInfo;
  setFieldsInfo: React.Dispatch<React.SetStateAction<FieldsInfo>>;
};

export type FieldMethods = {
  onChange: (value: any) => void;
  onBlur: () => void;
};

export type FieldsInfo = {
  touched: string[];
  focused: string[];
  dirty: string[];
};

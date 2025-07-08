export type FormContext = Partial<{}>;

export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "select"
  | "date";

export type BaseField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

export type TextField = BaseField & {
  type: "text" | "email" | "password";
  maxLength?: number;
};

export type NumberField = BaseField & {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
};

export type SelectField = BaseField & {
  type: "select";
  options: { value: string; label: string }[];
};

export type DateField = BaseField & {
  type: "date";
  min?: string; // ISO date string
  max?: string; // ISO date string
};

export type Field = TextField | NumberField | SelectField | DateField;

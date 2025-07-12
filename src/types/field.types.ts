export type BaseField = {
  name: string;
  label: string;
  initialValue?: unknown;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

export type Field = BaseField & {
  type: string;
};

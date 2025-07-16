export type BaseField = {
  name: string;
  label: string;
  initialValue?: unknown;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  options?: Array<{ label: string; value: string | number }>;
};

export type Field = BaseField & {
  type: string;
};

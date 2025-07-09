export type FormContext = Partial<{}>;

export type BaseField = {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

export type FieldMethods = {
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any> | React.KeyboardEvent<any>) => void;
};

import type { Field } from "./field.types";

export type OnUpdate = {
  preventUpdate?: boolean;
};

export type FormUserProps = {
  fields: Field[];
  onUpdate?: (props: {
    fieldName: string;
    value: unknown;
    updateFieldsState: (newState: Record<string, unknown>) => void;
    previousState: Record<string, unknown>;
    currentState: Record<string, unknown>;
  }) => void | Promise<OnUpdate | void>;
  onChange?: (props: {
    fieldName: string;
    value: unknown;
    updateFieldsState: (newState: Record<string, unknown>) => void;
    previousState: Record<string, unknown>;
    currentState: Record<string, unknown>;
  }) => void | Promise<void>;
};

export type FormContext = FormUserProps & {
  fieldsState: Record<string, unknown>;
  setFieldsState: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;

  fieldsInfo: FieldsInfo;
  setFieldsInfo: React.Dispatch<React.SetStateAction<FieldsInfo>>;
};

export type FieldMethods = {
  onChange: (value: unknown) => void;
  onBlur: () => void;
};

export type FieldsInfo = {
  touched: string[];
  focused: string[];
  dirty: string[];
  previousState: Record<string, unknown>;
};

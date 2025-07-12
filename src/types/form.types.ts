import type { Field } from "./field.types";

export type OnUpdate = {
  preventUpdate?: boolean;
};

export type FormApi = {
  reset: () => void;
  updateFieldsState: (newState: Record<string, unknown>) => void;
  setFieldsState: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  setFieldsInfo: React.Dispatch<React.SetStateAction<FieldsInfo>>;
  fieldsState: Record<string, unknown>;
  fieldsInfo: FieldsInfo;
};

export type FormUserProps = {
  fields: Field[];
  onUpdate?: (props: {
    fieldName: string;
    value: unknown;
    updateFieldsState: FormApi["updateFieldsState"];
    reset: () => void;
    previousState: Record<string, unknown>;
    currentState: Record<string, unknown>;
  }) => void | Promise<OnUpdate | void>;
  onChange?: (props: {
    fieldName: string;
    value: unknown;
    reset: () => void;
    updateFieldsState: FormApi["updateFieldsState"];
    previousState: Record<string, unknown>;
    currentState: Record<string, unknown>;
  }) => void | Promise<void>;
};

export type FormUserConfigProps = Partial<{
  formApi: React.RefObject<FormApi | null>;
  children: React.ReactNode | null | ((formApi: FormApi) => React.ReactNode);
}>;

export type FormContext = FormUserProps & {
  fieldsState: Record<string, unknown>;
  setFieldsState: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;

  fieldsInfo: FieldsInfo;
  setFieldsInfo: React.Dispatch<React.SetStateAction<FieldsInfo>>;

  reset: () => void;
  updateFieldsState: FormApi["updateFieldsState"];
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
  initialState: Record<string, unknown>;
};

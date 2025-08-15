import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { Field } from "./field.types";

export type OnUpdate = {
  preventUpdate?: boolean;
};

export type FormApi<T> = {
  reset: () => void;
  updateFieldsState: (newState: Partial<T>) => void;
  setFieldsState: React.Dispatch<React.SetStateAction<T>>;
  setFieldsInfo: React.Dispatch<React.SetStateAction<FieldsInfo<T>>>;
  setDisabled: (fieldName: keyof T, disabled: boolean) => void;
  setError: (fieldName: keyof T, error: string | null) => void;
  setFieldValue: (fieldName: keyof T, value: T[keyof T]) => void;
  setDidSubmitOnce: React.Dispatch<React.SetStateAction<boolean>>;
  checkForErrors: () => Promise<void>;
  fieldsState: T;
  isSubmitting: boolean;
  didSubmitOnce: boolean;
  hasSomeError: boolean;
  fieldsInfo: FieldsInfo<T>;
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export type onSubmitProps<T> = {
  state: T;
  errors: Record<keyof T, string | null>;
  success: boolean;
};

export type onUpdateProps<T> = {
  fieldName: keyof T;
  value: T[keyof T];
  previousState: T;
  currentState: T;
};

export type onChangeProps<T> = {
  fieldName: keyof T;
  value: T[keyof T];
  previousState: T;
  currentState: T;
};

export type FormUserProps<T, G extends StandardSchemaV1> = {
  fields: Field[];
  onSubmit?: ({
    errors,
    success,
    state,
  }: onSubmitProps<T>) => void | Promise<void>;
  onUpdate?: (props: onUpdateProps<T>) => void | Promise<OnUpdate | void>;
  onChange?: (props: onChangeProps<T>) => void | Promise<void>;
  schema: G;
};

export type FormFallbackProps = {
  field: Field;
};

export type FormUserConfigProps<T> = Partial<{
  formApi: React.RefObject<FormApi<T> | null>;
  formClassName: string;
  forceFieldChangeState: T;
  initialDisabledFields: (keyof T)[];
  children: React.ReactNode | null | ((formApi: FormApi<T>) => React.ReactNode);
  fieldWrapper?: (fieldComp: React.ReactNode) => React.ReactNode;
}>;

export type FormContext<T, G extends StandardSchemaV1> = FormUserProps<T, G> & {
  fieldsState: T;
  setFieldsState: React.Dispatch<React.SetStateAction<T>>;

  fieldsInfo: FieldsInfo<T>;
  setFieldsInfo: React.Dispatch<React.SetStateAction<FieldsInfo<T>>>;

  didSubmitOnce: boolean;
  isSubmitting: boolean;

  setFieldValue: (fieldName: keyof T, value: T[keyof T]) => void;

  reset: () => void;
  updateFieldsState: FormApi<T>["updateFieldsState"];
};

export type FieldMethods = {
  onChange: (value: unknown) => Promise<void>;
  onBlur: () => void;
  onFocus: () => void;
};

export type FieldsInfo<T> = {
  touched: string[];
  focused: string[];
  dirty: string[];
  blurred: string[];
  errors: Record<keyof T, string>;
  disabled: (keyof T)[];
  previousState: T;
  initialState: T;
};

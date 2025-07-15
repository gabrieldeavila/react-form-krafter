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
  fieldsState: T;
  fieldsInfo: FieldsInfo<T>;
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export type FormUserProps<T, G extends StandardSchemaV1> = {
  fields: Field[];
  onSubmit?: ({
    errors,
    success,
    state,
  }: {
    state: T;
    errors: Record<keyof T, string | null>;
    success: boolean;
  }) => void | Promise<void>;
  onUpdate?: (props: {
    fieldName: keyof T;
    value: T[keyof T];
    previousState: T;
    currentState: T;
  }) => void | Promise<OnUpdate | void>;
  onChange?: (props: {
    fieldName: keyof T;
    value: T[keyof T];
    previousState: T;
    currentState: T;
  }) => void | Promise<void>;
  schema: G;
};

export type FormUserConfigProps<T> = Partial<{
  formApi: React.RefObject<FormApi<T> | null>;
  formClassName?: string;
  children: React.ReactNode | null | ((formApi: FormApi<T>) => React.ReactNode);
}>;

export type FormContext<T, G extends StandardSchemaV1> = FormUserProps<T, G> & {
  fieldsState: T;
  setFieldsState: React.Dispatch<React.SetStateAction<T>>;

  fieldsInfo: FieldsInfo<T>;
  setFieldsInfo: React.Dispatch<React.SetStateAction<FieldsInfo<T>>>;

  didSubmitOnce: boolean;

  reset: () => void;
  updateFieldsState: FormApi<T>["updateFieldsState"];
};

export type FieldMethods = {
  onChange: (value: unknown) => void;
  onBlur: () => void;
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

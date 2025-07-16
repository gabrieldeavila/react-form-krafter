/* eslint-disable react-refresh/only-export-components */
import type { StandardSchemaV1 } from "@standard-schema/spec";
import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import type {
  FieldsInfo,
  FormContext,
  FormUserConfigProps,
  FormUserProps,
} from "../types";
import Field from "./field";

const FormContext = createContext<FormContext<
  unknown,
  StandardSchemaV1<unknown, unknown>
> | null>(null);

const Form = <T, G extends StandardSchemaV1>({
  formApi,
  formClassName,
  ...props
}: FormUserConfigProps<T> & FormUserProps<T, G>) => {
  const initialState: T = useMemo(
    () =>
      Object.fromEntries(
        props.fields.map((field) => [field.name, field.initialValue])
      ) as T,
    [props.fields]
  );

  const [fieldsState, setFieldsState] = useState<T>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmitOnce, setDidSubmitOnce] = useState(false);

  const [fieldsInfo, setFieldsInfo] = useState<FieldsInfo<T>>({
    dirty: [],
    focused: [],
    touched: [],
    blurred: [],
    initialState,
    errors: {} as Record<keyof T, string>,
    disabled: [],
    previousState: initialState,
  });

  // #TODO: we could create a wrapper and only change the key - it would reset and scale better
  const reset = useCallback(() => {
    setFieldsState(fieldsInfo.initialState);
    setFieldsInfo((prevInfo) => ({
      ...prevInfo,
      previousState: fieldsInfo.initialState,
      dirty: [],
      focused: [],
      touched: [],
      blurred: [],
      errors: {} as Record<keyof T, string>,
      disabled: [],
      initialState: fieldsInfo.initialState,
    }));
    setDidSubmitOnce(false);
  }, [fieldsInfo.initialState, setFieldsInfo, setFieldsState]);

  const updateFieldsState = useCallback(
    (newState: Partial<T>) => {
      setFieldsState((prevState) => {
        const updatedState = {
          ...prevState,
          ...newState,
        };

        setFieldsInfo((prevInfo) => ({
          ...prevInfo,
          previousState: {
            ...prevInfo.previousState,
            ...Object.entries(newState).reduce(
              (acc, [key, value]) => ({
                ...acc,
                [key]: value,
              }),
              {}
            ),
          },
        }));

        return updatedState;
      });
    },
    [setFieldsInfo, setFieldsState]
  );

  const setDisabled = useCallback(
    (fieldName: keyof T, disabled: boolean) => {
      setFieldsInfo((prevInfo) => {
        const disabledFields = disabled
          ? [...prevInfo.disabled, fieldName]
          : prevInfo.disabled.filter((name) => name !== fieldName);

        return {
          ...prevInfo,
          disabled: disabledFields,
        };
      });
    },
    [setFieldsInfo]
  );

  const setError = useCallback(
    (fieldName: keyof T, error: string | null) => {
      setFieldsInfo((prevInfo) => {
        const errors = { ...prevInfo.errors };

        if (error === null) {
          delete errors[fieldName];
        } else {
          errors[fieldName] = error;
        }

        return {
          ...prevInfo,
          errors,
        };
      });
    },
    [setFieldsInfo]
  );

  const onFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      try {
        event.preventDefault();
        event.stopPropagation();
        setIsSubmitting(true);
        setDidSubmitOnce(true);

        if (props.onSubmit) {
          await props.onSubmit({
            state: fieldsState,
            errors: fieldsInfo.errors,
            success: Object.keys(fieldsInfo.errors).length === 0,
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [props, fieldsState, fieldsInfo.errors]
  );

  const formValue = useMemo<FormContext<T, G>>(
    () => ({
      ...props,
      fieldsInfo,
      setFieldsInfo,
      fieldsState,
      setFieldsState,
      reset,
      updateFieldsState,
      didSubmitOnce,
      isSubmitting,
    }),
    [
      didSubmitOnce,
      fieldsInfo,
      fieldsState,
      isSubmitting,
      props,
      reset,
      updateFieldsState,
    ]
  );

  const formApiValue = useMemo(
    () => ({
      reset,
      updateFieldsState,
      setFieldsInfo,
      setFieldsState,
      fieldsState,
      fieldsInfo,
      setDisabled,
      setError,
      onFormSubmit,
      isSubmitting,
    }),
    [
      fieldsInfo,
      fieldsState,
      isSubmitting,
      onFormSubmit,
      reset,
      setDisabled,
      setError,
      updateFieldsState,
    ]
  );

  useImperativeHandle(formApi, () => formApiValue, [formApiValue]);

  return (
    <FormContext.Provider
      value={
        formValue as FormContext<unknown, StandardSchemaV1<unknown, unknown>>
      }
    >
      <Suspense fallback={<div>Loading...</div>}>
        <form className={formClassName} onSubmit={onFormSubmit}>
          {props.fields?.map((field, index) => {
            return <Field key={index} field={field} />;
          })}

          {props.children && typeof props.children === "function"
            ? props.children(formApiValue)
            : props.children}
        </form>
      </Suspense>
    </FormContext.Provider>
  );
};

export default Form;

export function useForm<T>() {
  const context = useContext(FormContext) as FormContext<
    T,
    StandardSchemaV1<T, unknown>
  > | null;

  if (!context) {
    throw new Error("useForm must be used within a Form");
  }

  return context;
}

export function useInternalForm() {
  // this hook should only be used internally by the library
  // it provides access to the form context without exposing the FormContext type
  // it should not be used by end users of the library
  // it is a convenience hook that wraps useForm and casts the context to FormContext<any>

  const context = useContext(FormContext) as FormContext<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    StandardSchemaV1<any, unknown>
  > | null;

  if (!context) {
    throw new Error("useInternalForm must be used within a Form");
  }

  return context;
}

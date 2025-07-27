/* eslint-disable react-refresh/only-export-components */
import type { StandardSchemaV1 } from "@standard-schema/spec";
import {
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
import { FormContextCreate } from "./internal";

const Form = <T, G extends StandardSchemaV1>({
  formApi,
  formClassName,
  initialDisabledFields,
  loaderFallback,
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
    disabled: initialDisabledFields ?? ([] as (keyof T)[]),
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

  const setFieldValue = useCallback(
    async (fieldName: keyof T, value: T[keyof T]) => {
      if (!fieldName) {
        console.warn("Field name is required to set value");
        return;
      }

      setFieldsState((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    },
    [setFieldsState]
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
      setFieldValue,
    }),
    [
      didSubmitOnce,
      fieldsInfo,
      fieldsState,
      isSubmitting,
      props,
      reset,
      setFieldValue,
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
      setFieldValue,
      didSubmitOnce,
    }),
    [
      didSubmitOnce,
      fieldsInfo,
      fieldsState,
      isSubmitting,
      onFormSubmit,
      reset,
      setDisabled,
      setError,
      setFieldValue,
      updateFieldsState,
    ]
  );

  const LoaderFallback = useCallback(() => {
    if (loaderFallback) {
      return loaderFallback;
    }
    return <div>...</div>;
  }, [loaderFallback]);

  useImperativeHandle(formApi, () => formApiValue, [formApiValue]);

  return (
    <FormContextCreate.Provider
      value={
        formValue as FormContext<unknown, StandardSchemaV1<unknown, unknown>>
      }
    >
      <Suspense fallback={<LoaderFallback />}>
        <form className={formClassName} onSubmit={onFormSubmit}>
          {props.fields?.map((field, index) => {
            return <Field key={index} field={field} />;
          })}

          {props.children && typeof props.children === "function"
            ? props.children(formApiValue)
            : (props.children as React.ReactNode)}
        </form>
      </Suspense>
    </FormContextCreate.Provider>
  );
};

export default Form;

export function useForm<T>() {
  const context = useContext(FormContextCreate) as FormContext<
    T,
    StandardSchemaV1<T, unknown>
  > | null;

  if (!context) {
    throw new Error("useForm must be used within a Form");
  }

  return context;
}

/* eslint-disable react-refresh/only-export-components */
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
import type { StandardSchemaV1 } from "@standard-schema/spec";

const FormContext = createContext<FormContext<unknown, StandardSchemaV1<unknown, unknown>> | null>(null);

const Form = <T, G extends StandardSchemaV1>({
  formApi,
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

  const [fieldsInfo, setFieldsInfo] = useState<FieldsInfo<T>>({
    dirty: [],
    focused: [],
    touched: [],
    initialState,
    previousState: initialState,
  });

  const reset = useCallback(() => {
    setFieldsState(fieldsInfo.initialState);
    setFieldsInfo((prevInfo) => ({
      ...prevInfo,
      previousState: fieldsInfo.initialState,
      dirty: [],
      focused: [],
      touched: [],
    }));
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

  const formValue = useMemo<FormContext<T, G>>(
    () => ({
      ...props,
      fieldsInfo,
      setFieldsInfo,
      fieldsState,
      setFieldsState,
      reset,
      updateFieldsState,
    }),
    [fieldsInfo, fieldsState, props, reset, updateFieldsState]
  );

  useImperativeHandle(
    formApi,
    () => ({
      reset,
      updateFieldsState,
      setFieldsInfo,
      setFieldsState,
      fieldsState,
      fieldsInfo,
    }),
    [fieldsInfo, fieldsState, reset, updateFieldsState]
  );

  return (
    <FormContext.Provider value={formValue as FormContext<unknown, StandardSchemaV1<unknown, unknown>>}>
      <Suspense fallback={<div>Loading...</div>}>
        {props.fields?.map((field, index) => {
          return <Field key={index} field={field} />;
        })}

        {props.children && typeof props.children === "function"
          ? props.children(formValue)
          : props.children}
      </Suspense>
    </FormContext.Provider>
  );
};

export default Form;

export function useForm<T>() {
  const context = useContext(FormContext) as FormContext<T, StandardSchemaV1<T, unknown>> | null;

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const context = useContext(FormContext) as FormContext<any, StandardSchemaV1<any, unknown>> | null;

  if (!context) {
    throw new Error("useInternalForm must be used within a Form");
  }

  return context;
}

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

const FormContext = createContext<FormContext | null>(null);

const Form = ({ formApi, ...props }: FormUserConfigProps & FormUserProps) => {
  const [fieldsState, setFieldsState] = useState<Record<string, unknown>>({});

  const initialState = useMemo(
    () =>
      Object.fromEntries(
        props.fields.map((field) => [field.name, field.initialValue])
      ),
    [props.fields]
  );

  const [fieldsInfo, setFieldsInfo] = useState<FieldsInfo>({
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
    (newState: Record<string, unknown>) => {
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

  const formValue = useMemo<FormContext>(
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
    <FormContext.Provider value={formValue}>
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

export const useForm = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useForm must be used within a Form");
  }

  return context;
};

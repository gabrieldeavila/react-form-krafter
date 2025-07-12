/* eslint-disable react-refresh/only-export-components */
import { createContext, Suspense, useContext, useMemo, useState } from "react";
import type { FieldsInfo, FormContext, FormUserProps } from "../types";
import Field from "./field";

const FormContext = createContext<FormContext | null>(null);

const Form = (props: FormUserProps) => {
  const [fieldsState, setFieldsState] = useState<Record<string, unknown>>({});

  const [fieldsInfo, setFieldsInfo] = useState<FieldsInfo>({
    dirty: [],
    focused: [],
    touched: [],
    previousState: Object.fromEntries(
      props.fields.map((field) => [field.name, field.initialValue])
    ),
  });

  const formValue = useMemo<FormContext>(
    () => ({
      ...props,
      fieldsInfo,
      setFieldsInfo,
      fieldsState,
      setFieldsState,
    }),
    [fieldsInfo, fieldsState, props]
  );

  return (
    <FormContext.Provider value={formValue}>
      <Suspense fallback={<div>Loading...</div>}>
        {props.fields?.map((field, index) => {
          return <Field key={index} field={field} />;
        })}
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

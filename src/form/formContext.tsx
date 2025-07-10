import { createContext, Suspense, useContext } from "react";
import type { FormContext } from "../types";
import Field from "./field";

const FormContext = createContext<FormContext>({});

const Form = (props: FormContext) => {
  return (
    <FormContext.Provider value={props}>
      <Suspense fallback={<div>Loading...</div>}>
        {props.fields?.map((field, index) => {
          return <Field key={index} {...field} />;
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

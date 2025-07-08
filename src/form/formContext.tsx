import { createContext, useContext } from "react";
import type { FormContext } from "../types";

const FormContext = createContext<FormContext>({});

const Form = (props: { children: React.ReactNode }) => {
  return (
    <FormContext.Provider value={{}}>{props.children}</FormContext.Provider>
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

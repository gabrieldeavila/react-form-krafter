/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from "react";
import type { RegisterContext } from "../types";

const RegisterContext = createContext<RegisterContext<unknown> | null>(null);

const Register = <T,>({
  children,
  components,
  settings = {},
}: RegisterContext<T> & { children: React.ReactNode }) => {
  const value = useMemo(
    () => ({ components, settings }),
    [components, settings]
  );
  
  return (
    <RegisterContext.Provider value={value as RegisterContext<unknown>}>
      {children}
    </RegisterContext.Provider>
  );
};

export default Register;

export const useRegister = () => {
  const context = useContext(RegisterContext);

  if (!context) {
    throw new Error("useRegister must be used within a Register");
  }

  return context;
};

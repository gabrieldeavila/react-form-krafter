import { createContext, useContext, useMemo } from "react";
import type { RegisterContext } from "../types";

const RegisterContext = createContext<RegisterContext>({});

const Register = ({
  children,
  components = [],
}: RegisterContext & { children: React.ReactNode }) => {
  const value = useMemo(() => ({ components }), [components]);

  return (
    <RegisterContext.Provider value={value}>
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

import type { FormContext } from "@lib/types";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createContext, useContext } from "react";

export const FormContextCreate = createContext<FormContext<
  unknown,
  StandardSchemaV1<unknown, unknown>
> | null>(null);

export const FieldsStateContext = createContext<Record<string, unknown> | null>(
  null
);

export const FieldsInfoContext = createContext<Record<string, unknown> | null>(
  null
);

export function useInternalForm() {
  // this hook should only be used internally by the library
  // it provides access to the form context without exposing the FormContext type
  // it should not be used by end users of the library
  // it is a convenience hook that wraps useForm and casts the context to FormContext<any>

  const context = useContext(FormContextCreate) as FormContext<
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

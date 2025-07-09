import type { JSX } from "react/jsx-dev-runtime";
import type { BaseField, FieldMethods } from "./form.types";

export type RegisterField = BaseField & {
  value?: any;
  error?: string | null;
};

export type RegisterComponent = {
  type: string; // e.g., "text", "select", etc.
  render: (field: RegisterField, methods: FieldMethods) => JSX.Element;
};

export type RegisterContext = Partial<{
  components: RegisterComponent[];
}>;

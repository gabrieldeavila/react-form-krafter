import type { ComponentType } from "react";
import type { BaseField } from "./field.types";
import type { FieldMethods } from "./form.types";

export type RegisterField = BaseField & {
  value?: any;
  error?: string | null;
};

export type RegisterComponent = {
  type: string; // e.g., "text", "select", etc.
  render: ComponentType<{
    field: RegisterField;
    methods: FieldMethods;
  }>;
};

export type RegisterContext = Partial<{
  components: RegisterComponent[];
}>;

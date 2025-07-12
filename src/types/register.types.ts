import type { ComponentType } from "react";
import type { BaseField } from "./field.types";
import type { FieldMethods } from "./form.types";

export type RegisterField = BaseField & {
  value: unknown;
  error: string | null;
  isTouched: boolean;
  isDirty: boolean;
  isFocused: boolean;
  isDefaultValue: boolean;
  isPristine: boolean;
};

export type RegisterFieldRenderProps = {
  field: RegisterField;
  methods: FieldMethods;
};

export type RegisterComponent = {
  type: string; // e.g., "text", "select", etc.
  render: ComponentType<RegisterFieldRenderProps>;
};

export type RegisterSettings = Partial<{
  updateDebounce: number; // Debounce time for updates in milliseconds
}>;

export type RegisterContext = {
  components: RegisterComponent[];
  settings?: RegisterSettings;
};

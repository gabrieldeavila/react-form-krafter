import type { ComponentType } from "react";
import type { BaseField } from "./field.types";
import type { FieldMethods } from "./form.types";

export type RegisterField<T> = BaseField & {
  value: T;
  error: string | null;
  isTouched: boolean;
  isDirty: boolean;
  isFocused: boolean;
  isDefaultValue: boolean;
  isPristine: boolean;
  isBlurred: boolean;
  isDisabled: boolean;
  isErrorVisible: boolean;
};

export type RegisterFieldRenderProps<T> = {
  field: RegisterField<T>;
  methods: FieldMethods;
};

export type RegisterComponent<T> = {
  type: string; // e.g., "text", "select", etc.
  render: ComponentType<RegisterFieldRenderProps<T>>;
};

export type RegisterSettings = Partial<{
  updateDebounce: number; // Debounce time for updates in milliseconds
}>;

export type RegisterContext<T> = {
  components: RegisterComponent<T>[];
  settings?: RegisterSettings;
};

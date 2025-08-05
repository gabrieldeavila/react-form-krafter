import type { FieldMethods, RegisterField } from "@lib/types";
import { memo } from "react";

export type FieldBaseProps = {
  field: RegisterField<string | number>;
  methods: FieldMethods;
  type?: string;
};

const FieldBase = memo(
  ({
    methods,
    field,
    type,
    onFieldChange,
  }: FieldBaseProps & {
    onFieldChange: (value: unknown) => string | number;
  }) => {
    return (
      <div className="field-wrapper">
        <label htmlFor={field.name}>{field.label}</label>

        <input
          type={type}
          placeholder={field.placeholder}
          id={field.name}
          name={field.name}
          required={field.required}
          disabled={field.isDisabled}
          onFocus={methods.onFocus}
          value={
            type === "number"
              ? Number(field.value)
              : typeof field.value === "string"
              ? field.value
              : ""
          }
          defaultValue={
            type === "number"
              ? Number(field.initialValue)
              : String(field.initialValue)
          }
          onChange={(e) => methods.onChange(onFieldChange(e.target.value))}
          onBlur={methods.onBlur}
        />

        {field.error && field.isErrorVisible && <span className="error">{field.error}</span>}
      </div>
    );
  }
);

export default FieldBase;

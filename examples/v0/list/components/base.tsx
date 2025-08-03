import type { FieldMethods, RegisterField } from "@lib/types";
import { memo, useMemo } from "react";

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
    const name = useMemo(() => {
      if (field.metadata?.listIndex !== undefined) {
        return `${field.name}-${field.metadata.listIndex}`;
      }
      return field.name;
    }, [field.metadata?.listIndex, field.name]);

    return (
      <div className="field-wrapper">
        <label htmlFor={name}>{field.label}</label>

        <input
          type={type}
          placeholder={field.placeholder}
          id={name}
          name={name}
          required={field.required}
          disabled={field.isDisabled}
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
          onFocus={methods.onFocus}
          onBlur={methods.onBlur}
        />

        {field.error && field.isErrorVisible && (
          <span className="error">{field.error}</span>
        )}
      </div>
    );
  }
);

export default FieldBase;

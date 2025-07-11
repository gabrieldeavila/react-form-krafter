import { memo } from "react";
import type { FieldMethods, RegisterField } from "../../../../types";

export type FieldBaseProps = {
  field: RegisterField;
  methods: FieldMethods;
  type?: string;
};

const FieldBase = memo(
  ({ methods, field, type }: FieldBaseProps) => {
    return (
      <div>
        <label htmlFor={field.name}>{field.label}</label>

        <input
          type={type}
          placeholder={field.placeholder}
          id={field.name}
          name={field.name}
          required={field.required}
          disabled={field.disabled}
          value={field.value}
          defaultValue={field.initialValue}
          onChange={(e) => methods.onChange(e.target.value)}
          onBlur={methods.onBlur}
        />

        {field.error && <span className="error">{field.error}</span>}
      </div>
    );
  }
);

export default FieldBase;

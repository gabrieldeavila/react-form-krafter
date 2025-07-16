import type {
  FieldMethods,
  RegisterField,
  RegisterFieldRenderProps,
} from "@lib/types";
import { memo, type FC } from "react";

type FieldBaseProps = {
  field: RegisterField<string | number>;
  methods: FieldMethods;
};

const Select: FC<RegisterFieldRenderProps<string | number>> = memo(
  ({ methods, field }: FieldBaseProps) => {
    return (
      <div className="field-wrapper">
        <label htmlFor={field.name}>{field.label}</label>

        <select
          id={field.name}
          name={field.name}
          required={field.required}
          disabled={field.isDisabled}
          value={field.value}
          defaultValue={field.initialValue as string | number}
          onChange={(e) => methods.onChange(e.target.value)}
          onBlur={methods.onBlur}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {field.error && field.isErrorVisible && (
          <span className="error">{field.error}</span>
        )}
      </div>
    );
  }
);

export default Select;

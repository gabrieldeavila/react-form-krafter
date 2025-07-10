import type { FieldMethods, RegisterField } from "../../../../types";

function FieldText({
  methods,
  field,
}: {
  field: RegisterField;
  methods: FieldMethods;
}) {
  return (
    <div>
      <label htmlFor={field.name}>{field.label}</label>

      <input
        type="text"
        placeholder={field.placeholder}
        id={field.name}
        name={field.name}
        required={field.required}
        disabled={field.disabled}
        value={field.value}
        {...methods}
      />

      {field.error && <span className="error">{field.error}</span>}
    </div>
  );
}

export default FieldText;

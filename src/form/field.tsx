import { useCallback, useMemo } from "react";
import { useRegister } from "../register/registerContext";
import type { Field } from "../types/field.types";
import { useForm } from "./formContext";
import type { RegisterField } from "../types";

function FieldComponent({ field }: { field: Field }) {
  const { components } = useRegister();
  const { setFieldsState, setFieldsInfo, fieldsState, fieldsInfo } = useForm();

  const Component = useMemo(
    () => components?.find((c) => c.type === field.type)?.render,
    [components, field.type]
  );

  const handleChange = useCallback(
    (value: unknown) => {
      setFieldsInfo((prevInfo) => ({
        ...prevInfo,
        dirty: prevInfo.dirty.includes(field.name)
          ? prevInfo.dirty
          : [...(prevInfo.dirty || []), field.name],
      }));

      setFieldsState((prevState) => ({
        ...prevState,
        [field.name]: value,
      }));
    },
    [field.name, setFieldsInfo, setFieldsState]
  );

  const handleBlur = useCallback(() => {}, []);

  const value = useMemo(
    () => fieldsState[field.name],
    [fieldsState, field.name]
  );

  const isTouched = useMemo(
    () => fieldsInfo.touched?.includes(field.name),
    [fieldsInfo, field.name]
  );

  const isDirty = useMemo(
    () => fieldsInfo.dirty?.includes(field.name),
    [fieldsInfo, field.name]
  );

  const isPristine = useMemo(() => !isDirty, [isDirty]);

  const isFocused = useMemo(
    () => fieldsInfo.focused?.includes(field.name),
    [fieldsInfo, field.name]
  );

  const isDefaultValue = useMemo(
    () => value === field.initialValue,
    [value, field.initialValue]
  );

  const fieldData = useMemo<RegisterField>(
    () => ({
      ...field,
      value,
      isTouched,
      isDirty,
      isFocused,
      isDefaultValue,
      isPristine,
      error: null, // Error handling can be added later
    }),
    [field, value, isTouched, isDirty, isFocused, isDefaultValue, isPristine]
  );

  return (
    <div>
      {Component ? (
        <Component
          field={fieldData}
          methods={{ onChange: handleChange, onBlur: handleBlur }}
        />
      ) : (
        "Field not found"
      )}
    </div>
  );
}

export default FieldComponent;

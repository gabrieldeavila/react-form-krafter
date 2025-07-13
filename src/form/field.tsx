import { useCallback, useMemo, useRef } from "react";
import { useRegister } from "../register/registerContext";
import type { Field } from "../types/field.types";
import { useInternalForm } from "./formContext";
import type { FieldsInfo, RegisterField } from "../types";
import { standardValidate } from "../validation/standard";

function FieldComponent({ field }: { field: Field }) {
  const { components, settings } = useRegister();
  const {
    onUpdate,
    onChange,
    setFieldsState,
    setFieldsInfo,
    fieldsState,
    fieldsInfo,
    updateFieldsState,
    reset,
    schema,
  } = useInternalForm();

  const timerRef = useRef<number | null>(null);

  const Component = useMemo(
    () => components?.find((c) => c.type === field.type)?.render,
    [components, field.type]
  );

  const handleBlur = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (schema) {
      const validationResult = standardValidate(schema, fieldsState);
      if (validationResult instanceof Promise) {
        await validationResult;
      }

      console.log("Validation result:", validationResult);
    }

    const updateProps = await onUpdate?.({
      fieldName: field.name,
      value: fieldsState[field.name],
      updateFieldsState,
      previousState: fieldsInfo.previousState,
      currentState: fieldsState,
      reset,
    });

    if (updateProps?.preventUpdate) {
      // return to previous state if update is prevented
      setFieldsState((prevState: Record<string, unknown>) => ({
        ...prevState,
        [field.name]:
          fieldsInfo.previousState[field.name] || field.initialValue, // Fallback to initial value if not set
      }));
      return;
    }

    setFieldsInfo((prevInfo: FieldsInfo<Record<string, unknown>>) => ({
      ...prevInfo,
      previousState: {
        ...prevInfo.previousState,
        [field.name]: fieldsState[field.name],
      },
    }));
  }, [
    schema,
    onUpdate,
    field.name,
    field.initialValue,
    fieldsState,
    updateFieldsState,
    fieldsInfo.previousState,
    reset,
    setFieldsInfo,
    setFieldsState,
  ]);

  const handleChange = useCallback(
    (value: unknown) => {
      setFieldsInfo((prevInfo) => ({
        ...prevInfo,
        dirty: prevInfo.dirty.includes(field.name)
          ? prevInfo.dirty
          : [...(prevInfo.dirty || []), field.name],
      }));

      setFieldsState((prevState: Record<string, unknown>) => ({
        ...prevState,
        [field.name]: value,
      }));

      onChange?.({
        fieldName: field.name,
        value,
        updateFieldsState,
        reset,
        previousState: fieldsInfo.previousState,
        currentState: fieldsState,
      });

      if (settings?.updateDebounce) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(async () => {
          await handleBlur();
          timerRef.current = null;
        }, settings.updateDebounce);
      }
    },
    [
      field.name,
      fieldsInfo.previousState,
      fieldsState,
      handleBlur,
      onChange,
      setFieldsInfo,
      setFieldsState,
      settings?.updateDebounce,
      updateFieldsState,
      reset,
    ]
  );

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

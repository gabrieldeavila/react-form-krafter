import { useCallback, useMemo, useRef } from "react";
import { useRegister } from "../register/registerContext";
import type { Field } from "../types/field.types";
import { useForm } from "./formContext";
import type { RegisterField } from "../types";

function FieldComponent({ field }: { field: Field }) {
  const { components, settings } = useRegister();
  const {
    onUpdate,
    onChange,
    setFieldsState,
    setFieldsInfo,
    fieldsState,
    fieldsInfo,
  } = useForm();

  const timerRef = useRef<number | null>(null);

  const Component = useMemo(
    () => components?.find((c) => c.type === field.type)?.render,
    [components, field.type]
  );

  const updateFieldsState = useCallback(
    (newState: Record<string, unknown>) => {
      setFieldsState((prevState) => {
        const updatedState = {
          ...prevState,
          ...newState,
        };

        setFieldsInfo((prevInfo) => ({
          ...prevInfo,
          previousState: {
            ...prevInfo.previousState,
            ...Object.entries(newState).reduce(
              (acc, [key, value]) => ({
                ...acc,
                [key]: value,
              }),
              {}
            ),
          },
        }));

        return updatedState;
      });
    },
    [setFieldsInfo, setFieldsState]
  );

  const handleBlur = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const updateProps = await onUpdate?.({
      fieldName: field.name,
      value: fieldsState[field.name],
      updateFieldsState,
      previousState: fieldsInfo.previousState,
      currentState: fieldsState,
    });

    if (updateProps?.preventUpdate) {
      // return to previous state if update is prevented
      setFieldsState((prevState) => ({
        ...prevState,
        [field.name]:
          fieldsInfo.previousState[field.name] || field.initialValue, // Fallback to initial value if not set
      }));
      return;
    }

    setFieldsInfo((prevInfo) => ({
      ...prevInfo,
      previousState: {
        ...prevInfo.previousState,
        [field.name]: fieldsState[field.name],
      },
    }));
  }, [
    field.initialValue,
    field.name,
    fieldsInfo.previousState,
    fieldsState,
    onUpdate,
    setFieldsInfo,
    setFieldsState,
    updateFieldsState,
  ]);

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

      onChange?.({
        fieldName: field.name,
        value,
        updateFieldsState,
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

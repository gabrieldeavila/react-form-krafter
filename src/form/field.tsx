import { useCallback, useMemo, useRef } from "react";
import { useRegister } from "../register/registerContext";
import type { FieldsInfo, RegisterField } from "../types";
import type { Field } from "../types/field.types";
import { standardValidate } from "../validation/standard";
import { useInternalForm } from "./internal";

function FieldComponent({ field }: { field: Field }) {
  const { components, settings } = useRegister();
  const {
    onUpdate,
    onChange,
    setFieldsState,
    setFieldsInfo,
    fieldsState,
    fieldsInfo,
    schema,
    didSubmitOnce,
  } = useInternalForm();

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const Component = useMemo(
    () => components?.find((c) => c.type === field.type)?.render,
    [components, field.type]
  );

  const handleFieldUpdate = useCallback(
    async ({ isBlur }: { isBlur: boolean }) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (isBlur) {
        setFieldsInfo((prevInfo) => ({
          ...prevInfo,
          blurred: prevInfo.blurred.includes(field.name)
            ? prevInfo.blurred
            : [...(prevInfo.blurred || []), field.name],
        }));
      }

      if (schema) {
        const validationResult = await standardValidate(schema, fieldsState);

        if (validationResult instanceof Array) {
          const issues = validationResult.reduce(
            (acc, issue) => ({
              ...acc,
              [issue.path.join(".")]: issue.message,
            }),
            {}
          );

          setFieldsInfo((prevInfo) => ({
            ...prevInfo,
            errors: issues,
          }));
        } else if (validationResult === true) {
          setFieldsInfo((prevInfo) => ({
            ...prevInfo,
            errors: {} as Record<keyof Record<string, unknown>, string>,
          }));
        }
      }

      const updateProps = await onUpdate?.({
        fieldName: field.name,
        value: fieldsState[field.name],
        previousState: fieldsInfo.previousState,
        currentState: fieldsState,
      });

      if (
        updateProps &&
        "preventUpdate" in updateProps &&
        updateProps.preventUpdate
      ) {
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
    },
    [
      field.initialValue,
      field.name,
      fieldsInfo.previousState,
      fieldsState,
      onUpdate,
      schema,
      setFieldsInfo,
      setFieldsState,
    ]
  );

  const handleBlur = useCallback(async () => {
    handleFieldUpdate({ isBlur: true });
  }, [handleFieldUpdate]);

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
        previousState: fieldsInfo.previousState,
        currentState: fieldsState,
      });

      if (settings?.updateDebounce) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(async () => {
          await handleFieldUpdate({
            isBlur: false,
          });
          timerRef.current = null;
        }, settings.updateDebounce);
      }
    },
    [
      field.name,
      fieldsInfo.previousState,
      fieldsState,
      handleFieldUpdate,
      onChange,
      setFieldsInfo,
      setFieldsState,
      settings?.updateDebounce,
    ]
  );

  const handleFocus = useCallback(() => {
    setFieldsInfo((prevInfo) => ({
      ...prevInfo,
      focused: prevInfo.focused.includes(field.name)
        ? prevInfo.focused
        : [...(prevInfo.focused || []), field.name],
    }));
  }, [field.name, setFieldsInfo]);

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

  const isBlurred = useMemo(
    () => fieldsInfo.blurred?.includes(field.name),
    [fieldsInfo, field.name]
  );

  const isFocused = useMemo(
    () => fieldsInfo.focused?.includes(field.name),
    [fieldsInfo, field.name]
  );

  const isDefaultValue = useMemo(
    () => value === field.initialValue,
    [value, field.initialValue]
  );

  const isDisabled = useMemo(
    () => fieldsInfo.disabled?.includes(field.name),
    [fieldsInfo, field.name]
  );

  const fieldData = useMemo<RegisterField<unknown>>(
    () => ({
      ...field,
      value,
      isTouched,
      isDirty,
      isFocused,
      isDefaultValue,
      isPristine,
      isBlurred,
      isDisabled: isDisabled || field.disabled || false,
      error: fieldsInfo.errors?.[field.name] || null,
      isErrorVisible: isBlurred || didSubmitOnce,
    }),
    [
      field,
      value,
      isTouched,
      isDirty,
      isFocused,
      isDefaultValue,
      isPristine,
      isBlurred,
      isDisabled,
      fieldsInfo.errors,
      didSubmitOnce,
    ]
  );

  if (!Component) {
    console.error(`Component for field type "${field.type}" was not found.`);
    return null;
  }

  return (
    <Component
      field={fieldData}
      methods={{
        onChange: handleChange,
        onBlur: handleBlur,
        onFocus: handleFocus,
      }}
    />
  );
}

export default FieldComponent;

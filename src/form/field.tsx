import { memo, useCallback, useMemo, useRef } from "react";
import { useRegister } from "../register/registerContext";
import type { FieldsInfo, RegisterComponent, RegisterField } from "../types";
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

  const promiseChange = useRef<Promise<void> | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const Component = useMemo(
    () => components?.find((c) => c.type === field.type)?.render,
    [components, field.type]
  );

  const checkForErrors = useCallback(
    async (
      currentFieldsState: Record<string, unknown>,
      currentFieldsInfo: FieldsInfo<Record<string, unknown>>,
      field: Field,
      fieldValue: unknown
    ) => {
      if ((fieldValue == null || fieldValue == "") && field.required) {
        setFieldsInfo((prevInfo) => ({
          ...prevInfo,
          errors: {
            ...prevInfo.errors,
            [field.name]: settings?.labels?.required || "REQUIRED_FIELD_ERROR",
          },
        }));
      } else if (schema) {
        const validationResult = await standardValidate(
          schema,
          currentFieldsState
        );

        if (validationResult instanceof Array) {
          const issues = validationResult.reduce(
            (acc, issue) => {
              const name = issue.path.join(".");

              if (name !== field.name) {
                return acc;
              }

              if (fieldValue != null) {
                acc[name] = issue.message;
              }

              return acc;
            },
            { ...currentFieldsInfo.errors, [field.name]: null }
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
    },
    [schema, setFieldsInfo, settings?.labels?.required]
  );

  const handleFieldUpdate = useCallback(
    async ({ isBlur }: { isBlur: boolean }) => {
      await promiseChange.current;

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

      const currentFieldsState: Record<string, unknown> = await new Promise(
        (resolve) => {
          setFieldsState((prevState: Record<string, unknown>) => {
            resolve(prevState);
            return prevState;
          });
        }
      );

      const currentFieldsInfo: FieldsInfo<Record<string, unknown>> =
        await new Promise((resolve) => {
          setFieldsInfo((prevInfo: FieldsInfo<Record<string, unknown>>) => {
            resolve(prevInfo);
            return prevInfo;
          });
        });

      const fieldValue = currentFieldsState[field.name];

      // if the field is the same as the previous state, do not update
      if (
        currentFieldsInfo.previousState[field.name] === fieldValue &&
        !currentFieldsInfo.dirty.includes(field.name)
      ) {
        return;
      }

      checkForErrors(currentFieldsState, currentFieldsInfo, field, fieldValue);

      const updateProps = await onUpdate?.({
        fieldName: field.name,
        value: fieldValue,
        previousState: currentFieldsInfo.previousState,
        currentState: currentFieldsState,
      });

      if (
        updateProps &&
        "preventUpdate" in updateProps &&
        updateProps.preventUpdate
      ) {
        // return to the previous state if update is prevented
        setFieldsState((prevState: Record<string, unknown>) => ({
          ...prevState,
          [field.name]:
            currentFieldsInfo.previousState[field.name] || field.initialValue, // Fallback to initial value if not set
        }));

        checkForErrors(
          currentFieldsInfo.previousState,
          currentFieldsInfo,
          field,
          fieldValue
        );
        return;
      }

      setFieldsInfo((prevInfo: FieldsInfo<Record<string, unknown>>) => ({
        ...prevInfo,
        previousState: {
          ...prevInfo.previousState,
          [field.name]: fieldValue,
        },
      }));
    },
    [checkForErrors, field, onUpdate, setFieldsInfo, setFieldsState]
  );

  const handleBlur = useCallback(() => {
    handleFieldUpdate({ isBlur: true });
  }, [handleFieldUpdate]);

  const handleChange = useCallback(
    async (value: unknown) => {
      let handleResolvePromise: () => void = () => {};
      promiseChange.current = new Promise((resolve) => {
        handleResolvePromise = resolve;
      });

      try {
        setFieldsInfo((prevInfo) => ({
          ...prevInfo,
          dirty: prevInfo.dirty.includes(field.name)
            ? prevInfo.dirty
            : [...(prevInfo.dirty || []), field.name],
        }));

        const currentFieldsInfo: FieldsInfo<Record<string, unknown>> =
          await new Promise((resolve) => {
            setFieldsInfo((prevInfo: FieldsInfo<Record<string, unknown>>) => {
              resolve(prevInfo);
              return prevInfo;
            });
          });

        const currentFieldsState: Record<string, unknown> = await new Promise(
          (resolve) => {
            setFieldsState((prevState: Record<string, unknown>) => {
              resolve(prevState);
              return prevState;
            });
          }
        );

        setFieldsState((prevState: Record<string, unknown>) => ({
          ...prevState,
          [field.name]: value,
        }));

        onChange?.({
          fieldName: field.name,
          value,
          previousState: currentFieldsInfo.previousState,
          currentState: currentFieldsState,
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
      } finally {
        if (promiseChange.current) {
          promiseChange.current = null;
          handleResolvePromise();
        }
      }
    },
    [
      field.name,
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

  const error = useMemo(() => {
    return fieldsInfo.errors?.[field.name] || null;
  }, [fieldsInfo.errors, field.name]);

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
      error: error,
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
      error,
      didSubmitOnce,
    ]
  );

  const methods = useMemo(
    () => ({
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
    }),
    [handleChange, handleBlur, handleFocus]
  );

  if (!Component) {
    console.error(`Component for field type "${field.type}" was not found.`);
    return null;
  }

  return (
    <FieldWrapper Component={Component} field={fieldData} methods={methods} />
  );
}

const FieldWrapper = memo(
  ({
    Component,
    field,
    methods,
  }: {
    Component: RegisterComponent<unknown>["render"];
    field: RegisterField<unknown>;
    methods: {
      onChange: (value: unknown) => Promise<void>;
      onBlur: () => void;
      onFocus: () => void;
    };
  }) => {
    return <Component field={field} methods={methods} />;
  }
);

export default FieldComponent;

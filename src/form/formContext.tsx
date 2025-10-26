/* eslint-disable react-refresh/only-export-components */
import { standardValidate } from "@lib/validation/standard";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type Field,
  type FieldsInfo,
  type FormApi,
  type FormContext,
  type FormUserConfigProps,
  type FormUserProps,
} from "@lib/types";
import FieldComp from "./field";
import {
  FieldsInfoContext,
  FieldsStateContext,
  FormContextCreate,
} from "./internal";

const Form = <T, G extends StandardSchemaV1>({
  formApi,
  formClassName,
  initialDisabledFields,
  forceFieldChangeState,
  fieldWrapper,
  ...props
}: FormUserConfigProps<T> & FormUserProps<T, G>) => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const initialState: T = useMemo(
    () =>
      Object.fromEntries(
        props.fields.map((field) => [field.name, field.initialValue])
      ) as T,
    [props.fields]
  );

  const [fieldsState, setFieldsState] = useState<T>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmitOnce, setDidSubmitOnce] = useState(false);

  useEffect(() => {
    if (forceFieldChangeState) {
      setFieldsState(forceFieldChangeState);
    }
  }, [forceFieldChangeState]);

  const [fieldsInfo, setFieldsInfo] = useState<FieldsInfo<T>>({
    dirty: [],
    focused: [],
    touched: [],
    blurred: [],
    manualErrors: {} as Record<keyof T, string>,
    initialState,
    errors: {} as Record<keyof T, string>,
    disabled: initialDisabledFields ?? ([] as (keyof T)[]),
    previousState: initialState,
  });

  const hasSomeError = useMemo(
    () =>
      Object.keys(fieldsInfo.errors).some(
        (key) => fieldsInfo.errors[key as keyof T] != null
      ) ||
      Object.keys(fieldsInfo.manualErrors).some(
        (key) => fieldsInfo.manualErrors[key as keyof T] != null
      ),
    [fieldsInfo.errors, fieldsInfo.manualErrors]
  );

  // #TODO: we could create a wrapper and only change the key - it would reset and scale better
  const reset = useCallback(() => {
    setFieldsState(fieldsInfo.initialState);
    setFieldsInfo((prevInfo) => ({
      ...prevInfo,
      previousState: fieldsInfo.initialState,
      dirty: [],
      focused: [],
      touched: [],
      blurred: [],
      errors: {} as Record<keyof T, string>,
      manualErrors: {} as Record<keyof T, string>,
      disabled: [],
      initialState: fieldsInfo.initialState,
    }));
    setDidSubmitOnce(false);
  }, [fieldsInfo.initialState, setFieldsInfo, setFieldsState]);

  const updateFieldsState = useCallback(
    (newState: Partial<T>) => {
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

  const setDisabled = useCallback(
    (fieldName: keyof T, disabled: boolean) => {
      setFieldsInfo((prevInfo) => {
        const disabledFields = disabled
          ? [...prevInfo.disabled, fieldName]
          : prevInfo.disabled.filter((name) => name !== fieldName);

        return {
          ...prevInfo,
          disabled: disabledFields,
        };
      });
    },
    [setFieldsInfo]
  );

  const setError = useCallback(
    (fieldName: keyof T, error: string | null) => {
      setFieldsInfo((prevInfo) => {
        const manualErrors = { ...prevInfo.manualErrors };

        if (error === null) {
          delete manualErrors[fieldName];
        } else {
          manualErrors[fieldName] = error;
        }

        return {
          ...prevInfo,
          manualErrors,
        };
      });
    },
    [setFieldsInfo]
  );

  const checkForErrors = useCallback(async () => {
    let hasError = false;
    const validationResult = await standardValidate(props.schema, fieldsState);

    if (validationResult instanceof Array) {
      const issues = validationResult.reduce((acc, issue) => {
        const name = issue.path.join(".");

        acc[name] = issue.message;

        return acc;
      }, {});

      setFieldsInfo((prevInfo) => ({
        ...prevInfo,
        errors: issues,
      }));
      hasError = true;
    }

    if (!hasError) {
      hasError = Object.keys(fieldsInfo.manualErrors).some(
        (key) => fieldsInfo.manualErrors[key as keyof T] != null
      );
    }

    return { hasError };
  }, [props.schema, fieldsState, fieldsInfo.manualErrors]);

  const onFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      try {
        event.preventDefault();
        event.stopPropagation();
        const { hasError } = await checkForErrors();

        setIsSubmitting(true);
        setDidSubmitOnce(true);

        if (props.onSubmit) {
          await props.onSubmit({
            state: fieldsState,
            errors: fieldsInfo.errors,
            success: !hasError,
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [checkForErrors, props, fieldsState, fieldsInfo.errors]
  );

  const setFieldValue = useCallback(
    async (fieldName: keyof T, value: T[keyof T]) => {
      if (!fieldName) {
        console.warn("Field name is required to set value");
        return;
      }

      setFieldsState((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    },
    [setFieldsState]
  );

  const requestSubmit = useCallback(() => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  }, []);

  const formValue = useMemo<FormContext<T, G>>(
    () => ({
      ...props,
      fieldsInfo,
      setFieldsInfo,
      fieldsState,
      setFieldsState,
      reset,
      updateFieldsState,
      didSubmitOnce,
      isSubmitting,
      setFieldValue,
    }),
    [
      didSubmitOnce,
      fieldsInfo,
      fieldsState,
      isSubmitting,
      props,
      reset,
      setFieldValue,
      updateFieldsState,
    ]
  );

  const formApiValue = useMemo<FormApi<T>>(
    () => ({
      reset,
      updateFieldsState,
      setFieldsInfo,
      setFieldsState,
      fieldsState,
      fieldsInfo,
      setDisabled,
      setError,
      requestSubmit,
      formRef,
      onFormSubmit,
      isSubmitting,
      setFieldValue,
      didSubmitOnce,
      hasSomeError,
      checkForErrors,
      setDidSubmitOnce,
    }),
    [
      checkForErrors,
      didSubmitOnce,
      fieldsInfo,
      fieldsState,
      hasSomeError,
      isSubmitting,
      onFormSubmit,
      requestSubmit,
      reset,
      setDisabled,
      setError,
      setFieldValue,
      updateFieldsState,
    ]
  );

  const FieldWrapper = useCallback(
    ({ children, field }: { children: React.ReactNode; field: Field }) => {
      if (fieldWrapper) {
        return fieldWrapper(children, field);
      }

      return children;
    },
    [fieldWrapper]
  );

  useImperativeHandle(formApi, () => formApiValue, [formApiValue]);

  const fieldStateValue = useMemo(
    () => fieldsState as Record<string, unknown>,
    [fieldsState]
  );

  const fieldsInfoValue = useMemo(
    () => fieldsInfo as Record<string, unknown>,
    [fieldsInfo]
  );

  return (
    <FieldsStateContext.Provider value={fieldStateValue}>
      <FieldsInfoContext.Provider value={fieldsInfoValue}>
        <FormContextCreate.Provider
          value={
            formValue as FormContext<
              unknown,
              StandardSchemaV1<unknown, unknown>
            >
          }
        >
          <form className={formClassName} onSubmit={onFormSubmit} ref={formRef}>
            {props.fields?.map((field, index) => {
              return (
                <FieldWrapper key={index} field={field}>
                  <FieldComp field={field} />
                </FieldWrapper>
              );
            })}

            {props.children && typeof props.children === "function"
              ? props.children(formApiValue)
              : (props.children as React.ReactNode)}
          </form>
        </FormContextCreate.Provider>
      </FieldsInfoContext.Provider>
    </FieldsStateContext.Provider>
  );
};

export default Form;

export function useForm<T>() {
  const context = useContext(FormContextCreate) as FormContext<
    T,
    StandardSchemaV1<T, unknown>
  > | null;

  if (!context) {
    throw new Error("useForm must be used within a Form");
  }

  return context;
}

export function useFieldsState<T>(): T {
  const fieldsState = useContext(FieldsStateContext);

  if (!fieldsState) {
    throw new Error("useFieldsState must be used within a Form");
  }

  return fieldsState as T;
}

export function useFieldsInfo<T>(): FieldsInfo<T> {
  const fieldsInfo = useContext(FieldsInfoContext) as FieldsInfo<T> | null;

  if (!fieldsInfo) {
    throw new Error("useFieldsInfo must be used within a Form");
  }

  return fieldsInfo;
}

export function useFieldsErrors<T>(): Record<keyof T, string> {
  const fieldsInfo = useFieldsInfo<T>();

  return useMemo<Record<keyof T, string>>(
    () => fieldsInfo.errors,
    [fieldsInfo.errors]
  );
}

export function useFieldValue<T>(fieldName: keyof T): T[keyof T] {
  const fieldsState = useFieldsState<T>();

  return useMemo<T[keyof T]>(
    () => fieldsState[fieldName],
    [fieldsState, fieldName]
  );
}

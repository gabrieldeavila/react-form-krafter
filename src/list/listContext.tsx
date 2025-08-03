import { Form } from "@lib/form";
import {
  type Field,
  type FormApi,
  type ListApi,
  type ListContext,
} from "@lib/types";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createContext, useCallback, useMemo, useRef, useState } from "react";

const ListContext = createContext<ListContext<
  unknown,
  StandardSchemaV1<unknown, unknown>
> | null>(null);

const List = <T, G extends StandardSchemaV1>({
  children,
  ...userProps
}: ListContext<T, G>["userProps"]) => {
  const [items, setItems] = useState<T[]>(userProps.initialItems || []);
  const addRowApi = useRef<FormApi<T>>(null!);
  const [rowAddState, setRowAddState] = useState<T>(null!);

  const listValue = useMemo<ListContext<T, G>>(
    () => ({ userProps }),
    [userProps]
  );

  const addItem = useCallback(async () => {
    addRowApi.current.setDidSubmitOnce(true);

    await addRowApi.current.checkForErrors();

    if (addRowApi.current.hasSomeError) {
      userProps.addProps.onError?.(addRowApi.current.fieldsInfo.errors);
      return;
    }

    const newItem = addRowApi.current.fieldsState as T;

    const { item } = (await userProps.addProps.onSuccess?.(newItem)) ?? {};

    const itemToAdd = item || newItem;

    addRowApi.current.reset();
    setRowAddState(null!);

    setItems((prevItems) => [...prevItems, itemToAdd]);
  }, [userProps.addProps]);

  const removeItem = useCallback((index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  }, []);

  const updateItem = useCallback((index: number, item: T) => {
    setItems((prevItems) =>
      prevItems.map((prevItem, i) => (i === index ? item : prevItem))
    );
  }, []);

  const listApiValue = useMemo<ListApi<T>>(
    () => ({
      items,
      addItem,
      removeItem,
      updateItem,
    }),
    [items, addItem, removeItem, updateItem]
  );

  const fieldsFormProps = useMemo<Field[]>(
    () =>
      userProps.fields.map((field) => ({
        ...field,
        metadata: {
          ...(field.metadata || {}),
          isListField: true,
        },
      })),
    [userProps.fields]
  );

  const fieldsAddRow = useMemo<Field[]>(
    () =>
      fieldsFormProps.map((field) => ({
        ...field,
        metadata: {
          ...(field.metadata || {}),
          isAddRow: true,
        },
      })),
    [fieldsFormProps]
  );

  return (
    <ListContext.Provider
      value={
        listValue as ListContext<unknown, StandardSchemaV1<unknown, unknown>>
      }
    >
      <userProps.addProps.rowComponent
        onAdd={addItem}
        formApi={addRowApi}
        form={
          <Form
            forceFieldChangeState={rowAddState}
            formApi={addRowApi}
            fields={fieldsAddRow}
            schema={userProps.schema}
            formClassName={userProps.formProps?.formClassName}
            onChange={({ currentState, value, fieldName }) => {
              setRowAddState(() => ({
                ...currentState,
                [fieldName]: value,
              }));
            }}
          />
        }
      />

      {typeof children === "function" ? children(listApiValue) : children}
    </ListContext.Provider>
  );
};

export default List;

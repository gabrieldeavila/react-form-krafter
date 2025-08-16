import { Form } from "@lib/form";
import {
  type Field,
  type FormApi,
  type ListAddSuccessReturn,
  type ListApi,
  type ListContext,
} from "@lib/types";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import {
  createContext,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

const ListContext = createContext<ListContext<
  unknown,
  StandardSchemaV1<unknown, unknown>
> | null>(null);

const ListApiContext = createContext<ListApi<unknown> | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useListApi = <T,>() => {
  const context = useContext(ListApiContext);
  if (!context) {
    throw new Error("useListApi must be used within a List component");
  }
  return context as ListApi<T>;
};

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

    const { item } = ((await userProps.addProps.onSuccess?.(newItem)) ??
      {}) as ListAddSuccessReturn<T>;

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

  const insertItems = useCallback((newItems: T[]) => {
    setItems((prevItems) => [...prevItems, ...newItems]);
  }, []);

  const removeItems = useCallback((indices: number[]) => {
    setItems((prevItems) => prevItems.filter((_, i) => !indices.includes(i)));
  }, []);

  const updateItems = useCallback(
    (updates: Array<{ index: number; item: T }>) => {
      setItems((prevItems) => {
        const newItems = [...prevItems];
        updates.forEach(({ index, item }) => {
          if (newItems[index]) {
            newItems[index] = item;
          }
        });
        return newItems;
      });
    },
    []
  );

  const listApiValue = useMemo<ListApi<T>>(
    () => ({
      items,
      addItem,
      removeItem,
      updateItem,
      insertItems,
      removeItems,
      updateItems,
    }),
    [
      items,
      addItem,
      removeItem,
      updateItem,
      insertItems,
      removeItems,
      updateItems,
    ]
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

  useImperativeHandle(
    userProps.listApi,
    () => ({
      addItem,
      removeItem,
      updateItem,
      items,
      insertItems,
      removeItems,
      updateItems,
    }),
    [
      addItem,
      removeItem,
      updateItem,
      items,
      insertItems,
      removeItems,
      updateItems,
    ]
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
      <ListApiContext.Provider value={listApiValue as ListApi<unknown>}>
        <userProps.addProps.rowComponent
          add={addItem}
          formApi={addRowApi}
          form={
            <Form
              forceFieldChangeState={rowAddState}
              formApi={addRowApi}
              fields={fieldsAddRow}
              fieldWrapper={userProps.formProps?.fieldWrapper}
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

        {items.map((item, index) => (
          <FormItem
            key={index}
            fieldsFormProps={fieldsFormProps}
            userProps={userProps}
            item={item}
            index={index}
            updateItem={updateItem}
            removeItem={removeItem}
          />
        ))}

        {typeof children === "function" ? children(listApiValue) : children}
      </ListApiContext.Provider>
    </ListContext.Provider>
  );
};

export default List;

const FormItem = <T, G extends StandardSchemaV1>({
  fieldsFormProps,
  userProps,
  item,
  index,
  updateItem,
  removeItem,
}: {
  fieldsFormProps: Field[];
  userProps: ListContext<T, G>["userProps"];
  item: T;
  index: number;
  updateItem: ListApi<T>["updateItem"];
  removeItem: ListApi<T>["removeItem"];
}) => {
  const itemApi = useRef<FormApi<T>>(null!);

  const itemFields = useMemo(
    () =>
      fieldsFormProps.map((field) => ({
        ...field,
        initialValue: (item as Record<string, unknown>)[field.name],
        metadata: {
          ...(field.metadata || {}),
          listIndex: index,
        },
      })),
    [fieldsFormProps, index, item]
  );

  return (
    <userProps.itemsProps.rowComponent
      item={item}
      index={index}
      formApi={itemApi}
      remove={removeItem}
      form={
        <Form<T, G>
          forceFieldChangeState={item}
          formApi={itemApi}
          fields={itemFields}
          schema={userProps.schema}
          formClassName={userProps.formProps?.formClassName}
          onChange={(props) => {
            const { currentState, fieldName, value } = props;

            updateItem(index, { ...currentState, [fieldName]: value } as T);

            userProps.itemsProps.onChange?.({
              ...props,
              item,
              index,
            });
          }}
          onUpdate={(props) => {
            return userProps.itemsProps.onUpdate?.({
              ...props,
              item,
              index,
            });
          }}
        />
      }
    />
  );
};

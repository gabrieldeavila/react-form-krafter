import type { StandardSchemaV1 } from "@standard-schema/spec";
import type {
  FormApi,
  FormFallbackProps,
  FormUserProps,
  onChangeProps,
  OnUpdate,
  onUpdateProps,
} from "./form.types";

export type ListApi<T> = {
  addItem: () => Promise<void>;
  removeItem: (index: number) => void;
  updateItem: (index: number, item: T) => void;
  items: T[];
  insertItems: (items: T[]) => void;
  removeItems: (indices: number[]) => void;
  updateItems: (updates: Array<{ index: number; item: T }>) => void;
};

export type ListAddRowComponentProps<T> = {
  add: ListApi<T>["addItem"];
  formApi: React.RefObject<FormApi<T>>;
  form: React.ReactNode;
};

export type ListItemRowComponentProps<T> = {
  item: T;
  formApi: React.RefObject<FormApi<T>>;
  form: React.ReactNode;
  index: number;
  remove: ListApi<T>["removeItem"];
};

export type ListAddSuccessReturn<T> = Partial<{
  item: T;
}>;

export type ListAddSuccessProps<T> = ListAddSuccessReturn<T> | void;

export type ListUserProps<T, G extends StandardSchemaV1> = FormUserProps<
  T,
  G
> & {
  addProps: {
    rowComponent: React.FC<ListAddRowComponentProps<T>>;
    onSuccess?: (
      item: T
    ) => ListAddSuccessProps<T> | Promise<ListAddSuccessProps<T>>;
    onError?: (
      error: FormApi<T>["fieldsInfo"]["errors"]
    ) => void | Promise<void>;
  };
  itemsProps: {
    rowComponent: React.FC<ListItemRowComponentProps<T>>;
    onUpdate?: (
      props: onUpdateProps<T> & { item: T; index: number }
    ) => void | Promise<OnUpdate | void>;
    onChange?: (
      props: onChangeProps<T> & { item: T; index: number }
    ) => void | Promise<void>;
  };
};

export type ListUserConfigProps<T> = Partial<{
  initialItems: T[];
  listApi: React.RefObject<ListApi<T> | null>;
  listClassName: string;
  initialDisabledFields?: (keyof T)[];
  children: React.ReactNode | null | ((listApi: ListApi<T>) => React.ReactNode);
  formProps: Partial<{
    loaderFallback:
      | React.ReactNode
      | ((field: FormFallbackProps) => React.ReactNode);
    formClassName: string;
  }>;
}>;

export type ListContext<T, G extends StandardSchemaV1> = {
  userProps: ListUserProps<T, G> & ListUserConfigProps<T>;
};

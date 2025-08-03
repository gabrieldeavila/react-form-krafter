import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { FormApi, FormFallbackProps, FormUserProps } from "./form.types";

export type ListApi<T> = {
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, item: T) => void;
  items: T[];
};

export type ListAddRowComponentProps<T> = {
  onAdd: ListApi<T>["addItem"];
  formApi: React.RefObject<FormApi<T>>;
  form: React.ReactNode;
};

export type ListAddSuccessProps<T> = Partial<{
  item: T;
}> | void;

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

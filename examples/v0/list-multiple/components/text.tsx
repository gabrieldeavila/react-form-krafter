import { memo, type FC } from "react";
import FieldBase from "./base";
import type { RegisterFieldRenderProps } from "@lib/types";

const FieldText: FC<RegisterFieldRenderProps<string>> = memo(
  (props: RegisterFieldRenderProps<string>) => {
    return (
      <FieldBase
        {...props}
        type="text"
        onFieldChange={(value) => {
          return String(value);
        }}
      />
    );
  }
);

export default FieldText;

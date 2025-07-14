import { memo, type FC } from "react";
import type { RegisterFieldRenderProps } from "../../../../types";
import FieldBase from "./base";

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

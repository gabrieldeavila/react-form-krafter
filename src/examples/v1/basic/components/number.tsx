import { memo, type FC } from "react";
import type { RegisterFieldRenderProps } from "../../../../types";
import FieldBase from "./base";

const FieldNumber: FC<RegisterFieldRenderProps<number>> = memo(
  (props: RegisterFieldRenderProps<number>) => {
    return (
      <FieldBase
        {...props}
        type="number"
        onFieldChange={(value) => {
          const numValue = Number(value);
          return isNaN(numValue) ? 0 : numValue; // Ensure valid number
        }}
      />
    );
  }
);

export default FieldNumber;

import { memo, type FC } from "react";
import FieldBase from "./base";
import type { RegisterFieldRenderProps } from "react-form-factory";

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

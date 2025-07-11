import { memo } from "react";
import type { RegisterFieldRenderProps } from "../../../../types";
import FieldBase from "./base";

const FieldNumber = memo((props: RegisterFieldRenderProps) => {
  return <FieldBase {...props} type="number" />;
});

export default FieldNumber;

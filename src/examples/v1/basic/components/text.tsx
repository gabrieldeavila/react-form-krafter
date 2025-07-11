import { memo } from "react";
import type { RegisterFieldRenderProps } from "../../../../types";
import FieldBase from "./base";

const FieldText = memo((props: RegisterFieldRenderProps) => {
  return <FieldBase {...props} type="text" />;
});

export default FieldText;

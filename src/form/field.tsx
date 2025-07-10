import { useRegister } from "../register/registerContext";
import type { Field } from "../types/field.types";

function FieldComponent(props: Field) {
  const { components } = useRegister();
  const Component = components?.find((c) => c.type === props.type)?.render;

  return <div>{Component ? <Component field={props} methods={{}} /> : "Field not found"}</div>;
}

export default FieldComponent;

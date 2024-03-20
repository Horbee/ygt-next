import { Path, useController } from "react-hook-form"

import { Switch } from "@mantine/core"

import type { SwitchProps } from "@mantine/core";
import type { FieldValues, Control, RegisterOptions } from "react-hook-form";

interface Props<T extends FieldValues> extends SwitchProps {
  control: Control<T, any>;
  fieldName: Path<T>;
  rules?: RegisterOptions;
}

/**
 * Wrapper component around Mantine's Switch to work with the
 * value field of react-hook-form
 */
export function SwitchInputWrapper<T extends FieldValues>({
  control,
  fieldName,
  rules,
  ...restSwitchProps
}: Props<T>) {
  const {
    field: { onChange, onBlur, name, value, ref },
  } = useController<T>({
    name: fieldName,
    control,
    rules,
  });

  return (
    <Switch
      onChange={onChange}
      onBlur={onBlur}
      checked={value}
      name={name}
      ref={ref}
      {...restSwitchProps}
    />
  );
}

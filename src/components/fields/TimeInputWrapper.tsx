import { Path, useController } from "react-hook-form";

import { TimeInput } from "@mantine/dates";

import type { Control, FieldValues, RegisterOptions } from "react-hook-form";
import type { TimeInputProps } from "@mantine/dates";

interface Props<T extends FieldValues> extends TimeInputProps {
  control: Control<T, any>;
  fieldName: Path<T>;
  rules?: RegisterOptions<T>;
}

/**
 * Wrapper component around Mantine's TimeInput to work with the
 * onChange method of react-hook-form
 */
export function TimeInputWrapper<T extends FieldValues>({
  control,
  fieldName,
  rules,
  ...restInputProps
}: Props<T>) {
  const {
    field: { onChange, onBlur, name, value, ref },
  } = useController<T>({
    name: fieldName,
    control,
    rules,
  });

  return (
    <TimeInput
      onChange={(value) => onChange({ target: { value } })}
      onBlur={onBlur}
      value={value}
      name={name}
      ref={ref}
      {...restInputProps}
    />
  );
}

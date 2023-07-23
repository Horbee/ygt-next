import { Path, useController } from "react-hook-form";

import { DatePickerInput } from "@mantine/dates";

import type { Control, FieldValues, RegisterOptions } from "react-hook-form";
import type { DatePickerInputProps } from "@mantine/dates";

interface Props<T extends FieldValues> extends DatePickerInputProps {
  control: Control<T, any>;
  fieldName: Path<T>;
  rules?: RegisterOptions<T>;
}

/**
 * Wrapper component around Mantine's DatePickerInput to work with the
 * onChange method of react-hook-form
 */
export function DatePickerInputWrapper<T extends FieldValues>({
  control,
  fieldName,
  rules,
  ...restDatePickerProps
}: Props<T>) {
  const {
    field: { onChange, onBlur, name, value, ref },
  } = useController<T>({
    name: fieldName,
    control,
    rules,
  });

  return (
    <DatePickerInput
      onChange={(value) => onChange(value as any)}
      onBlur={onBlur}
      value={value}
      name={name}
      ref={ref}
      {...restDatePickerProps}
    />
  );
}

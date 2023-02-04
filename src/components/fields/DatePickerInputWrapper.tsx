import { Path, useController } from "react-hook-form"

import { DatePicker } from "@mantine/dates"

import type { Control, FieldValues, RegisterOptions } from "react-hook-form";
import type { DatePickerProps } from "@mantine/dates";

interface Props<T extends FieldValues> extends DatePickerProps {
  control: Control<T, any>;
  fieldName: Path<T>;
  rules?: RegisterOptions;
}

/**
 * Wrapper component around Mantine's DatePicker to work with the
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
    <DatePicker
      onChange={(value) => onChange({ target: { value } })}
      onBlur={onBlur}
      value={value}
      name={name}
      ref={ref}
      {...restDatePickerProps}
    />
  );
}

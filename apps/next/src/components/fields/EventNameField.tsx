import { Path, useController } from "react-hook-form";
import slugify from "slugify";

import { TextInput } from "@mantine/core";

import type { TextInputProps } from "@mantine/core";
import type { Control, FieldValues, RegisterOptions } from "react-hook-form";

interface Props<T extends FieldValues> extends TextInputProps {
  control: Control<T, any>;
  fieldName: Path<T>;
  rules?: RegisterOptions;
  setSlugValue: (value: string) => void;
}

export function EventNameField<T extends FieldValues>({
  control,
  fieldName,
  rules,
  setSlugValue,
  ...restTextInputProps
}: Props<T>) {
  const {
    field: { onChange, onBlur, name, value, ref },
  } = useController<T>({
    name: fieldName,
    control,
    rules,
  });

  return (
    <TextInput
      onChange={(e) => {
        onChange(e);
        setSlugValue(slugify(e.target.value, { lower: true }));
      }}
      onBlur={onBlur}
      value={value}
      name={name}
      ref={ref}
      {...restTextInputProps}
    />
  );
}

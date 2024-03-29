import { useRef } from "react";
import { Path, useController } from "react-hook-form";

import { Clock } from "lucide-react";
import { ActionIcon } from "@mantine/core";
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
  const inputRef = useRef<HTMLInputElement>(null);

  const { field } = useController<T>({
    name: fieldName,
    control,
    rules,
  });

  return (
    <TimeInput
      {...field}
      ref={inputRef}
      rightSection={
        <ActionIcon onClick={() => inputRef.current?.showPicker()}>
          <Clock size={16} />
        </ActionIcon>
      }
      {...restInputProps}
    />
  );
}

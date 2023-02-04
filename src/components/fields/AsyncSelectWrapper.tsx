import { Path, useController } from "react-hook-form"
import AsyncSelect from "react-select/async"

import type { AsyncProps } from "react-select/async";
import type { GroupBase } from "react-select";
import type { Control, FieldValues, RegisterOptions } from "react-hook-form";

interface Props<
  T extends FieldValues,
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> extends AsyncProps<Option, IsMulti, Group> {
  control: Control<T, any>;
  fieldName: Path<T>;
  rules?: RegisterOptions;
}

/**
 * Wrapper component around React Select's AsyncSelect to work with the
 * react-hook-form
 */
export function AsyncSelectWrapper<
  T extends FieldValues,
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  control,
  fieldName,
  rules,
  ...restProps
}: Props<T, Option, IsMulti, Group>) {
  const {
    field: { onChange, onBlur, name, value, ref },
  } = useController<T>({
    name: fieldName,
    control,
    rules,
  });

  return (
    <AsyncSelect
      onChange={(value) => onChange({ target: { value } })}
      onBlur={onBlur}
      value={value}
      name={name}
      ref={ref}
      {...restProps}
    />
  );
}

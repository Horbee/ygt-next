import { Path, useController } from "react-hook-form"
import ReactSelect from "react-select"

import { MultiValue } from "./custom-components"
import { useCombinedStyles } from "./style"

import type { ComponentProps, ElementType } from "react";
import type { Control, FieldValues, RegisterOptions } from "react-hook-form";
type Props<T extends FieldValues, C extends ElementType> = {
  control: Control<T, any>;
  fieldName: Path<T>;
  as?: C;
  rules?: RegisterOptions;
} & ComponentProps<C>;
/**
 * Wrapper component around React Select's AsyncSelect to work with the
 * react-hook-form
 */
export function ReactSelectWrapper<
  T extends FieldValues,
  C extends ElementType
>({ control, fieldName, as, rules, ...restProps }: Props<T, C>) {
  const styles = useCombinedStyles();

  const {
    field: { onChange, onBlur, name, value, ref },
  } = useController<T>({
    name: fieldName,
    control,
    rules,
  });

  const Component = as || ReactSelect;

  return (
    <Component
      onChange={(value: any) => onChange({ target: { value } })}
      onBlur={onBlur}
      value={value}
      name={name}
      ref={ref}
      styles={styles}
      components={{ MultiValue }}
      // menuIsOpen
      {...restProps}
    />
  );
}

import { Control, useController } from "react-hook-form";

import { Select } from "@mantine/core";

import { AvailabilityFormValues, AvailabilityOptions } from "../../types";

interface AvailabilitySelectProps {
  control: Control<AvailabilityFormValues, any>;
}

// TODO: refactor to be reusable
export const AvailabilitySelect = ({ control }: AvailabilitySelectProps) => {
  const {
    field: { onChange, onBlur, name, value, ref },
    fieldState: { error },
  } = useController<AvailabilityFormValues>({
    name: "available",
    control,
    rules: { required: "This field is required" },
    defaultValue: null,
  });

  return (
    <Select
      withAsterisk
      label="Availability"
      placeholder="Pick one"
      data={AvailabilityOptions}
      error={error?.message}
      onChange={onChange}
      onBlur={onBlur}
      value={value as string | null}
      name={name}
      ref={ref}
    />
  );
};

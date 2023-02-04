import { useController } from "react-hook-form"

import { TimeRangeInput } from "@mantine/dates"

import type { Control } from "react-hook-form";
import type { AvailabilityFormValues } from "../../types";

interface AppointmentTimeInputProps {
  control: Control<AvailabilityFormValues, any>;
}

// TODO: refactor to be reusable
export const AppointmentTimeInput = ({
  control,
}: AppointmentTimeInputProps) => {
  const {
    field: { onChange, onBlur, name, value, ref },
  } = useController<AvailabilityFormValues>({
    name: "time",
    control,
    defaultValue: [null, null],
  });

  return (
    <TimeRangeInput
      label="Appointment time"
      clearable
      onChange={onChange}
      onBlur={onBlur}
      value={value as [Date | null, Date | null]}
      name={name}
      ref={ref}
    />
  );
};

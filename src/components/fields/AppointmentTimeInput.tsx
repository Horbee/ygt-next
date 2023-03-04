import { Group } from "@mantine/core";

import { TimeInputWrapper } from "./TimeInputWrapper";

import type { Control } from "react-hook-form";
import type { AvailabilityFormValues } from "../../types";
interface AppointmentTimeInputProps {
  control: Control<AvailabilityFormValues, any>;
}

export const AppointmentTimeInput = ({ control }: AppointmentTimeInputProps) => {
  return (
    <Group grow>
      <TimeInputWrapper fieldName="fromTime" label="From" control={control} />
      <TimeInputWrapper fieldName="untilTime" label="Until" control={control} />
    </Group>
  );
};

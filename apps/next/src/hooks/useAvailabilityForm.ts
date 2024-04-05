import { useForm } from "react-hook-form";

import { mapToDateInput } from "../utils/format-date-time";

import type { Availability } from "@ygt/db";
import type { AvailabilityFormValues } from "../types";

export const useAvailabilityForm = (availability?: Availability) => {
  const defaultValues: AvailabilityFormValues = {
    available: availability?.available ?? null,
    fromTime: availability?.fromTime ? mapToDateInput(availability?.fromTime) : "",
    untilTime: availability?.untilTime ? mapToDateInput(availability?.untilTime) : "",
    comment: availability?.comment ?? "",
  };

  return useForm<AvailabilityFormValues>({
    defaultValues,
  });
};

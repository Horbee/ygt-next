import { useForm } from "react-hook-form";

import { Availability } from "@prisma/client";

import { mapToDateInput } from "../utils/format-date-time";

import type { AvailabilityFormValues, AvailableTypes } from "../types";
export const useAvailabilityForm = (availability?: Availability) => {
  const defaultValues: AvailabilityFormValues = {
    available: (availability?.available as AvailableTypes) ?? null,
    fromTime: availability?.fromTime ? mapToDateInput(availability?.fromTime) : "",
    untilTime: availability?.untilTime ? mapToDateInput(availability?.untilTime) : "",
    comment: availability?.comment ?? "",
  };

  return useForm<AvailabilityFormValues>({
    defaultValues,
  });
};

import { useForm } from "react-hook-form";

import { Availability } from "@prisma/client";

import type { AvailabilityFormValues, AvailableTypes } from "../types";

export const useAvailabilityForm = (availability?: Availability) => {
  const defaultValues: AvailabilityFormValues = {
    available: (availability?.available as AvailableTypes) ?? null,
    time: [
      availability?.fromTime ? new Date(availability?.fromTime) : null,
      availability?.untilTime ? new Date(availability?.untilTime) : null,
    ],
    comment: availability?.comment ?? "",
  };

  return useForm<AvailabilityFormValues>({
    defaultValues,
  });
};

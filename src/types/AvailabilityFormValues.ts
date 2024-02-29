import type { AvailabilityType } from "@prisma/client";

export type AvailabilityFormValues = {
  available: AvailabilityType | null;
  fromTime: string;
  untilTime: string;
  comment: string;
};

import type { AvailabilityType } from "@ygt/db";

export type AvailabilityFormValues = {
  available: AvailabilityType | null;
  fromTime: string;
  untilTime: string;
  comment: string;
};

import type { AvailableTypes } from "./Availability";

export type AvailabilityFormValues = {
  available: AvailableTypes | null;
  fromTime: string;
  untilTime: string;
  comment: string;
};

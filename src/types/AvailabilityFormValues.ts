import { AvailableTypes } from "./Availability"

export type AvailabilityFormValues = {
  available: AvailableTypes | null;
  time: [Date | null, Date | null];
  comment: string;
};

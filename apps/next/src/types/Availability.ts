import type { Availability, User, AvailabilityType } from "@ygt/db";

export type AvailabilityOption = { value: AvailabilityType; label: string };

export const AvailabilityOptions: AvailabilityOption[] = [
  { value: "GOOD", label: "Available" },
  { value: "MAYBE", label: "Maybe" },
  { value: "NOT_GOOD", label: "Not good" },
];

export interface AvailabilityDataWithOwner extends Availability {
  owner: User;
}

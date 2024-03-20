import type { Availability, User } from "@ygt/db";

export type AvailableTypes = "good" | "maybe" | "notgood";

export type AvailabilityOption = { value: AvailableTypes; label: string };

export const AvailabilityOptions: AvailabilityOption[] = [
  { value: "good", label: "Available" },
  { value: "maybe", label: "Maybe" },
  { value: "notgood", label: "Not good" },
];

export interface AvailabilityDataWithOwner extends Availability {
  owner: User;
}

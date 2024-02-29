import type { Availability, User, AvailabilityType, Reaction } from "@prisma/client";

export type AvailabilityOption = { value: AvailabilityType; label: string };

export const AvailabilityOptions: AvailabilityOption[] = [
  { value: "GOOD", label: "Available" },
  { value: "MAYBE", label: "Maybe" },
  { value: "NOT_GOOD", label: "Not good" },
];

export interface AvailabilityDataWithOwner extends Availability {
  owner: User;
}

export interface AvailabilityDataWithOwnerAndReactions extends Availability {
  owner: User;
  reactions: Reaction[];
}

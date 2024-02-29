import type { Attachment, Event, User } from "@prisma/client";

import type { AvailabilityDataWithOwner } from "./Availability";

export interface EventDataFull extends Event {
  owner: User;
  invitedUsers: User[];
  availabilities: AvailabilityDataWithOwner[] | null;
  coverImage?: Attachment | null;
}

export interface EventDataForm extends Event {
  owner: User;
  invitedUsers: { user: User }[];
  coverImage: Attachment | null;
}

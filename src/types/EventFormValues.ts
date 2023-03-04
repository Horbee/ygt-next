import type { User } from "@prisma/client";

export type EventFormValues = {
  name: string;
  slug: string;
  description: string | null;
  public: boolean;
  wholeDay: boolean;
  fromDate: Date | null;
  fromTime: string;
  untilDate: Date | null;
  untilTime: string;
  invitedUsers: User[];
  tags: { label: string; value: string }[];
  coverImageUrl: string | null;
};

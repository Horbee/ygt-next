import { User } from "@prisma/client";

export type EventFormValues = {
  name: string;
  slug: string;
  description: string | null;
  public: boolean;
  wholeDay: boolean;
  fromDate: Date | null;
  fromTime: Date | null;
  untilDate: Date | null;
  untilTime: Date | null;
  invitedUsers: User[];
  tags: { label: string; value: string }[];
  coverImageUrl: string | null;
};

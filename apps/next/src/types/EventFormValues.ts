import type { User } from "@ygt/db";

export type EventFormValues = {
  name: string;
  slug: string;
  description: string | null;
  public: boolean;
  published: boolean;
  wholeDay: boolean;
  fromDate: Date | null;
  fromTime: string;
  untilDate: Date | null;
  untilTime: string;
  invitedUsers: User[];
  tags: { label: string; value: string }[];
  coverImageUrl: string | null;
};

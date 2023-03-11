import { z } from "zod";

export const EventDto = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  public: z.boolean().optional(),
  wholeDay: z.boolean(),
  fromDate: z.date(),
  untilDate: z.date(),
  invitedUserIds: z.array(z.string()),
  tags: z.array(z.string()),
  coverImageId: z.string().nullable(),
});

export type EventDtoType = z.infer<typeof EventDto>;

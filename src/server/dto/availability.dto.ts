import { z } from "zod";

export const AvailabilityDto = z.object({
  available: z.enum(["GOOD", "MAYBE", "NOT_GOOD"]),
  comment: z.string().nullable(),
  date: z.date(),
  fromTime: z.date().nullable(),
  untilTime: z.date().nullable(),
  eventId: z.string(),
});

export type AvailabilityDtoType = z.infer<typeof AvailabilityDto>;

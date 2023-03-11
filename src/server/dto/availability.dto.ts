import { z } from "zod";

export const AvailabilityDto = z.object({
  available: z.enum(["good", "maybe", "notgood"]),
  comment: z.string().nullable(),
  date: z.date(),
  fromTime: z.date().nullable(),
  untilTime: z.date().nullable(),
  eventId: z.string(),
});

export type AvailabilityDtoType = z.infer<typeof AvailabilityDto>;

import { z } from "zod"

export const SubscriptionDto = z.object({
  endpoint: z.string(),
  expirationTime: z.date().nullable(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export type SubscriptionDtoType = z.infer<typeof SubscriptionDto>;

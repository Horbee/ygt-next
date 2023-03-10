import { z } from "zod";

import { SubscriptionDto } from "../../dto/subscription.dto";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notificationRouter = createTRPCRouter({
  subscribe: protectedProcedure
    .input(SubscriptionDto)
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.subscription.upsert({
        create: {
          ownerId: ctx.session.user.id,
          endpoint: input.endpoint, // Unique constraint is not yet working with embedded objects
          sub: input,
        },
        update: {
          ownerId: ctx.session.user.id,
          sub: input,
        },
        where: {
          ownerId_endpoint: {
            ownerId: ctx.session.user.id,
            endpoint: input.endpoint,
          },
        },
      });
    }),
});

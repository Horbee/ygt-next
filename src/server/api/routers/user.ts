import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  findAllByIdentifier: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.user.findMany({
        where: { email: { contains: input } },
      });
    }),
});

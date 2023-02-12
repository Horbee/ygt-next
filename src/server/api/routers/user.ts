import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  findAllByName: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    return ctx.prisma.user.findMany({
      where: { name: { contains: input, mode: "insensitive" } },
      take: 20,
    });
  }),
});

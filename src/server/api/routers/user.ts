import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  findAllByName: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    if (!input) return [];

    return ctx.prisma.user.findMany({
      where: { name: { contains: input, mode: "insensitive" } },
      take: 20,
    });
  }),
  updateUserData: protectedProcedure
    .input(z.object({ username: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.username },
      });
    }),
});

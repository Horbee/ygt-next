import { z } from "zod";

import { Subscription, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";

type UserWithSubscriptions = User & {
  subscriptions: Subscription[];
};

export const availabilityRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        available: z.enum(["good", "maybe", "notgood"]),
        comment: z.string().nullable(),
        date: z.date(),
        fromTime: z.date().nullable(),
        untilTime: z.date().nullable(),
        eventId: z.string(),
      })
    )
    .mutation(async ({ input: dto, ctx }) => {
      const userName = ctx.session.user.name;
      const userId = ctx.session.user.id;

      const event = await ctx.prisma.event.findFirst({
        where: { id: dto.eventId },
        include: {
          availabilities: { include: { owner: { include: { subscriptions: true } } } },
        },
      });

      if (
        !event?.public &&
        event?.ownerId !== userId &&
        !event?.invitedUserIds.includes(userId)
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is not the owner and not invited",
        });
      }

      const createdAv = await ctx.prisma.availability.create({
        data: { ...dto, ownerId: userId },
      });

      const users = event?.availabilities?.map((a) => a.owner) ?? [];
      const uniqueUsers = users.reduce(
        (unique, item) =>
          unique.some((u) => u.id === item.id) ? unique : [...unique, item],
        [] as UserWithSubscriptions[]
      );

      // await sendAvailabilityEmail(
      //   ctx.session.user.name!,
      //   uniqueUsers,
      //   event.slug,
      //   event.name,
      //   createdAv.date
      // );

      // .filter((u) => u.id !== ctx.session.user.id)
      const notificationPromises = uniqueUsers
        .flatMap((u) => u.subscriptions)
        .map((userSub) =>
          ctx.webPush.sendNotification(
            userSub.sub!,
            JSON.stringify({
              title: "You've got time",
              body: `${userName} added a new availbility!`,
            })
          )
        );

      await Promise.all(notificationPromises);

      return createdAv;
    }),

  updateById: protectedProcedure
    .input(
      z.object({
        availabilityId: z.string(),
        dto: z.object({
          available: z.enum(["good", "maybe", "notgood"]),
          comment: z.string().nullable(),
          date: z.date(),
          fromTime: z.date().nullable(),
          untilTime: z.date().nullable(),
          eventId: z.string(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { availabilityId, dto } = input;
      const userId = ctx.session.user.id;

      const event = await ctx.prisma.event.findFirst({
        where: { id: dto.eventId },
      });

      if (
        !event ||
        (!event.public &&
          event.ownerId !== userId &&
          !event.invitedUserIds.includes(userId))
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is not the owner and not invited",
        });
      }

      const avDoc = await ctx.prisma.availability.findFirst({
        where: { id: availabilityId, ownerId: userId },
      });

      if (!avDoc)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Availability not found or you are not the owner",
        });

      const { eventId, ...restUpdates } = dto;

      const updatedAv = await ctx.prisma.availability.update({
        data: restUpdates,
        where: { id: availabilityId },
      });

      return updatedAv;
    }),

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: availabilityId, ctx }) => {
      const userId = ctx.session.user.id;

      const avDoc = await ctx.prisma.availability.findFirst({
        where: { id: availabilityId, ownerId: userId },
      });

      if (!avDoc) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Availability not found or you are not the owner",
        });
      }

      const deletedAv = await ctx.prisma.availability.delete({
        where: { id: availabilityId },
      });

      return deletedAv;
    }),
});

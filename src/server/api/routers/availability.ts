import { z } from "zod";

import { Event } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure, TRPCContext } from "../trpc";

const sendPushNotification = async (event: Event, ctx: TRPCContext) => {
  const userName = ctx.session?.user.name;
  const url = "/events/" + event.slug;

  const users = await ctx.prisma.user.findMany({
    where: { availabilities: { some: { eventId: event.id } } },
    include: { subscriptions: true },
    distinct: ["id"],
  });

  try {
    // .filter((u) => u.id !== ctx.session.user.id)
    const notificationPromises = users
      .flatMap((u) => u.subscriptions)
      .map((userSub) =>
        ctx.webPush.sendNotification(
          userSub.sub!,
          JSON.stringify({
            title: "You've got time",
            body: `${userName} modified availbility for event ${event.name}`,
            url,
          })
        )
      );

    await Promise.all(notificationPromises);
    console.log(
      `Push notifications sent to ${users.length} users, ${notificationPromises.length} devices, eventID: ${event.id}`
    );
  } catch (error) {
    console.error("Push Notification error");
    console.error(error);
  }
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
      const userId = ctx.session.user.id;
      const event = await ctx.prisma.event.findFirst({ where: { id: dto.eventId } });

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

      await sendPushNotification(event, ctx);

      // await sendAvailabilityEmail(
      //   ctx.session.user.name!,
      //   uniqueUsers,
      //   event.slug,
      //   event.name,
      //   createdAv.date
      // );

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

      await sendPushNotification(event, ctx);

      return updatedAv;
    }),

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: availabilityId, ctx }) => {
      const userId = ctx.session.user.id;

      const avDoc = await ctx.prisma.availability.findFirst({
        where: { id: availabilityId, ownerId: userId },
        include: { event: true },
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

      await sendPushNotification(avDoc.event, ctx);

      return deletedAv;
    }),
});

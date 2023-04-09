import { z } from "zod";

import { Event } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { getFormattedDate } from "../../../hooks/useSelectedDate";
import { AvailabilityDto } from "../../dto/availability.dto";
import { createTRPCRouter, protectedProcedure, TRPCContext } from "../trpc";

const sendPushNotification = async (
  event: Event,
  availabilityDate: Date,
  ctx: TRPCContext
) => {
  const userName = ctx.session?.user.name;
  const url = `/events/${event.slug}?date=${getFormattedDate(availabilityDate)}`;

  const users = await ctx.prisma.user.findMany({
    where: { availabilities: { some: { eventId: event.id } } },
    include: { subscriptions: true },
    distinct: ["id"],
  });

  let sent = 0;
  let errors = 0;
  const notificationPromises = users
    .filter((u) => u.id !== ctx.session?.user.id)
    .flatMap((u) => u.subscriptions)
    .map((userSub) =>
      ctx.webPush
        .sendNotification(
          userSub.sub!,
          JSON.stringify({
            title: "You've got time",
            body: `${userName} modified availbility for event ${event.name}`,
            url,
          })
        )
        .then(() => sent++)
        .catch((error) => {
          errors++;
          console.error("Push Notification error");
          console.error(error);
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.error("Deleting old subscription");
            return ctx.prisma.subscription.delete({ where: { id: userSub.id } });
          }
        })
    );

  await Promise.allSettled(notificationPromises);

  console.log(
    `Push notifications sent to ${sent} devices, rejected: ${errors} devices, eventID: ${event.id}`
  );
};

export const availabilityRouter = createTRPCRouter({
  create: protectedProcedure
    .input(AvailabilityDto)
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

      await sendPushNotification(event, dto.date, ctx);

      return createdAv;
    }),

  updateById: protectedProcedure
    .input(
      z.object({
        availabilityId: z.string(),
        dto: AvailabilityDto,
      })
    )
    .mutation(async ({ input: { availabilityId, dto }, ctx }) => {
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

      const { eventId, ...restUpdates } = dto;

      const updatedAv = await ctx.prisma.availability.update({
        data: restUpdates,
        where: { ownerId_id: { id: availabilityId, ownerId: userId } },
      });

      if (!updatedAv)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Availability not found or you are not the owner",
        });

      await sendPushNotification(event, dto.date, ctx);

      return updatedAv;
    }),

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: availabilityId, ctx }) => {
      const userId = ctx.session.user.id;

      const deletedAv = await ctx.prisma.availability.delete({
        where: { ownerId_id: { id: availabilityId, ownerId: userId } },
        include: { event: true },
      });

      if (!deletedAv) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Availability not found or you are not the owner",
        });
      }

      await sendPushNotification(deletedAv.event, deletedAv.date, ctx);

      return deletedAv;
    }),
});

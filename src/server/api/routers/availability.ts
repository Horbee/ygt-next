import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { AvailabilityDto } from "../../dto/availability.dto";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  sendAvailabilityModificationPushNotifications,
  sendReactionPushNotifications,
} from "../helpers/send-push-notification";
import { getFormattedDate } from "../../../hooks/useSelectedDate";

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

      sendAvailabilityModificationPushNotifications(event, dto.date, ctx);

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

      sendAvailabilityModificationPushNotifications(event, dto.date, ctx);

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

      sendAvailabilityModificationPushNotifications(deletedAv.event, deletedAv.date, ctx);

      return deletedAv;
    }),
  toggleUserReaction: protectedProcedure
    .input(
      z.object({
        availabilityId: z.string(),
        reaction: z.object({ native: z.string(), shortcodes: z.string() }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id: userId, name: userName, email: userEmail } = ctx.session.user;
      const { availabilityId, reaction } = input;

      const availability = await ctx.prisma.availability.findFirst({
        where: {
          id: availabilityId,
          reactions: { some: { ownerId: userId, shortcodes: reaction.shortcodes } },
        },
      });

      let updatedAv;
      if (availability) {
        updatedAv = await ctx.prisma.availability.update({
          where: { id: availabilityId },
          data: {
            reactions: {
              deleteMany: { where: { ownerId: userId, shortcodes: reaction.shortcodes } },
            },
          },
          include: { event: true },
        });
      } else {
        updatedAv = await ctx.prisma.availability.update({
          where: { id: availabilityId },
          data: {
            reactions: {
              push: {
                ownerId: userId,
                ownerName: userName ?? userEmail!,
                emoji: reaction.native,
                shortcodes: reaction.shortcodes,
              },
            },
          },
          include: { event: true },
        });
      }

      if (!updatedAv)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Availability not found or you are not the owner",
        });

      // Send push notification only if reaction was added
      if (!availability) {
        const notificationUrl = `/events/${updatedAv.event.slug}?date=${getFormattedDate(
          updatedAv.date
        )}`;

        sendReactionPushNotifications(
          `${userName} reacted to your availability with: ${reaction.native}`,
          updatedAv.ownerId,
          notificationUrl,
          ctx
        );
      }

      return updatedAv;
    }),
});

import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { EventDto } from "../../dto/event.dto";
import { getEventsWhereClause } from "../helpers/get-events-helper";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { sendEventModificationPushNotification } from "../helpers/send-push-notification";

export const eventRouter = createTRPCRouter({
  getEvents: protectedProcedure
    .input(
      z.object({
        eventFilters: z.array(z.enum(["invited", "own", "public", "past"])),
        start: z.number(),
        size: z.number(),
      })
    )
    .query(async ({ input: { eventFilters, start, size }, ctx }) => {
      const where = getEventsWhereClause(eventFilters, ctx);

      const totalPromise = ctx.prisma.event.count({ where });

      const eventsPromise = ctx.prisma.event.findMany({
        where,
        include: { coverImage: true },
        skip: start,
        take: size,
        orderBy: { fromDate: "asc" },
      });

      const [total, events] = await Promise.all([totalPromise, eventsPromise]);

      return { content: events, total };
    }),

  getEventBySlug: protectedProcedure
    .input(z.object({ slug: z.string(), withAvailabilities: z.boolean().optional() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id;

      const { slug, withAvailabilities = false } = input;

      const event = await ctx.prisma.event.findFirst({
        where: {
          slug,
          OR: [
            { ownerId: userId },
            { invitedUserIds: { has: userId }, published: true },
            { public: true, published: true },
          ],
        },
        include: {
          owner: true,
          invitedUsers: true,
          coverImage: true,
          availabilities: withAvailabilities
            ? {
                include: { owner: true },
              }
            : false,
        },
      });

      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found." });

      return event;
    }),

  createEvent: protectedProcedure.input(EventDto).mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;

    const eventWithSlug = await ctx.prisma.event.findUnique({
      where: { slug: input.slug },
    });

    if (eventWithSlug) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Slug is already taken",
      });
    }

    const createdEvent = await ctx.prisma.event.create({
      data: {
        ...input,
        ownerId: user.id,
      },
    });

    if (createdEvent.published) {
      sendEventModificationPushNotification(
        createdEvent,
        `${user.name} created a new event: ${createdEvent.name}`,
        ctx
      );
    }

    return createdEvent;
  }),

  updateEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        eventDto: EventDto,
      })
    )
    .mutation(async ({ ctx, input: { eventId, eventDto } }) => {
      const user = ctx.session.user;

      const updatedEvent = await ctx.prisma.event.update({
        data: eventDto,
        where: { id: eventId, ownerId: user.id },
      });

      if (!updatedEvent) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Event not found or you are not the owner.",
        });
      }

      if (updatedEvent.published) {
        sendEventModificationPushNotification(
          updatedEvent,
          `${user.name} updated an event: ${updatedEvent.name}`,
          ctx
        );
      }

      return updatedEvent;
    }),

  deleteEvent: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: eventId }) => {
      const user = ctx.session.user;

      const deletedEvent = await ctx.prisma.event.delete({
        where: { id: eventId, ownerId: user.id },
      });

      if (!deletedEvent) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Event not found or you are not the owner.",
        });
      }

      if (deletedEvent.published) {
        sendEventModificationPushNotification(
          deletedEvent,
          `${user.name} deleted an event: ${deletedEvent.name}`,
          ctx
        );
      }
    }),

  getDistinctTags: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const eventsWithTags = await ctx.prisma.event.findMany({
        select: { tags: true },
        distinct: ["tags"],
      });

      const flat = [...new Set(eventsWithTags.flatMap((e) => e.tags))];

      return flat
        .filter((t) => t.match(new RegExp(input, "i")))
        .slice(0, 5)
        .map((t) => ({ label: t.toUpperCase(), value: t.toUpperCase() }));
    }),

  isSlugTaken: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const event = await ctx.prisma.event.findUnique({ where: { slug: input.slug } });
      return event !== null;
    }),
});

import { z } from "zod";

import { Event, Prisma, Subscription } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { EventDto } from "../../dto/event.dto";
import { createTRPCRouter, protectedProcedure, TRPCContext } from "../trpc";

const sendPushNotification = async (event: Event, body: string, ctx: TRPCContext) => {
  const url = "/events/" + event.slug;

  let subs: Subscription[] = [];

  if (event.public) {
    subs = await ctx.prisma.subscription.findMany();
  } else {
    const users = await ctx.prisma.user.findMany({
      where: { id: { in: event.invitedUserIds } },
      include: { subscriptions: true },
      distinct: ["id"],
    });
    subs = users.flatMap((u) => u.subscriptions);
  }

  let sent = 0;
  let errors = 0;

  const notificationPromises = subs
    .filter((s) => s.ownerId !== ctx.session?.user.id)
    .map((s) =>
      ctx.webPush
        .sendNotification(s.sub, JSON.stringify({ title: "You've got time", body, url }))
        .then(() => sent++)
        .catch((error) => {
          errors++;
          console.error("Push Notification error");
          console.error(error);
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.error("Deleting old subscription");
            return ctx.prisma.subscription.delete({ where: { id: s.id } });
          }
        })
    );

  await Promise.allSettled(notificationPromises);

  console.log(
    `Push notifications sent to ${sent} devices, rejected: ${errors} devices, eventID: ${event.id}`
  );
};

export const eventRouter = createTRPCRouter({
  getEvents: protectedProcedure
    .input(
      z.object({
        type: z.enum(["invited", "own", "public"]),
        showPast: z.boolean().optional(),
        start: z.number(),
        size: z.number(),
      })
    )
    .query(async ({ input: { type, showPast = false, start, size }, ctx }) => {
      const userId = ctx.session.user.id;

      const where: Prisma.EventWhereInput = {
        ownerId: type === "own" ? userId : undefined,
        invitedUserIds: type === "invited" ? { has: userId } : undefined,
        public: type === "public" ? true : undefined,
        untilDate: !showPast ? { gte: new Date() } : undefined,
      };

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
      const { slug, withAvailabilities = false } = input;

      const event = await ctx.prisma.event.findUnique({
        where: { slug },
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

    await sendPushNotification(
      createdEvent,
      `${user.name} created a new event: ${createdEvent.name}`,
      ctx
    );

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

      const event = await ctx.prisma.event.findFirst({
        where: { id: eventId },
      });

      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

      if (event.ownerId !== user.id)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the owner can update this event",
        });

      const updatedEvent = await ctx.prisma.event.update({
        data: eventDto,
        where: { id: eventId },
      });

      await sendPushNotification(
        updatedEvent,
        `${user.name} updated an event: ${updatedEvent.name}`,
        ctx
      );

      return updatedEvent;
    }),

  deleteEvent: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: eventId }) => {
      const user = ctx.session.user;

      const event = await ctx.prisma.event.findFirst({
        where: { id: eventId },
      });

      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

      if (event.ownerId !== user.id)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the owner can delete this event",
        });

      const deletedEvent = await ctx.prisma.event.delete({
        where: { id: eventId },
        include: { coverImage: true },
      });

      await sendPushNotification(
        deletedEvent,
        `${user.name} deleted an event: ${deletedEvent.name}`,
        ctx
      );

      return deletedEvent;
    }),
});

import { z } from "zod";

import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { deleteImage } from "./attachment";

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
    .input(
      z.object({ slug: z.string(), withAvailabilities: z.boolean().optional() })
    )
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

      if (!event)
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found." });

      return event;
    }),

  createEvent: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().nullable(),
        public: z.boolean().optional(),
        wholeDay: z.boolean(),
        fromDate: z.date(),
        fromTime: z.date().nullable(),
        untilDate: z.date(),
        untilTime: z.date().nullable(),
        invitedUserIds: z.array(z.string()),
        tags: z.array(z.string()),
        coverImageId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

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
          ownerId: userId,
        },
      });

      return createdEvent;
    }),

  updateEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        eventDto: z.object({
          name: z.string(),
          slug: z.string(),
          description: z.string().nullable(),
          public: z.boolean().optional(),
          wholeDay: z.boolean(),
          fromDate: z.date(),
          fromTime: z.date().nullable(),
          untilDate: z.date(),
          untilTime: z.date().nullable(),
          invitedUserIds: z.array(z.string()),
          tags: z.array(z.string()),
          coverImageId: z.string().nullable(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { eventId, eventDto } = input;
      const userId = ctx.session.user.id;

      const event = await ctx.prisma.event.findFirst({
        where: { id: eventId },
      });

      if (!event)
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

      if (event.ownerId !== userId)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the owner can update this event",
        });

      const updatedEvent = await ctx.prisma.event.update({
        data: eventDto,
        where: { id: eventId },
      });

      return updatedEvent;
    }),

  deleteEvent: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: eventId }) => {
      const userId = ctx.session.user.id;

      const event = await ctx.prisma.event.findFirst({
        where: { id: eventId },
      });

      if (!event)
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

      if (event.ownerId !== userId)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the owner can delete this event",
        });

      const deletedEvent = await ctx.prisma.event.delete({
        where: { id: eventId },
        include: { coverImage: true },
      });

      // If relation exists, try to delete image
      if (deletedEvent.coverImage) {
        try {
          await deleteImage(
            deletedEvent.coverImage.public_id,
            ctx.prisma,
            ctx.cloudinary
          );
        } catch (err) {
          console.error(
            `Cover image with id ${deletedEvent.coverImageId} can not be deleted`,
            err
          );
        }
      }

      return deletedEvent;
    }),
});

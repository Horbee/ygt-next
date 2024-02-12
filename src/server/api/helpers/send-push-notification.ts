import { TRPCContext } from "../trpc";
import { getFormattedDate } from "../../../hooks/useSelectedDate";

import type { Event, Subscription } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const sendEventModificationPushNotification = async (
  event: Event,
  body: string,
  ctx: TRPCContext
) => {
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

  // Filter currrent user out
  const finalSubs = subs.filter((s) => s.ownerId !== ctx.session?.user.id);

  console.log("Sending event modification push notifications");
  await pushSender(finalSubs, body, url, ctx);
};

export const sendAvailabilityModificationPushNotifications = async (
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

  const subscriptions = users
    //   Remove current user
    .filter((u) => u.id !== ctx.session?.user.id)
    .flatMap((u) => u.subscriptions);

  console.log("Sending availability modification push notifications.");
  await pushSender(
    subscriptions,
    `${userName} modified availbility for event ${event.name}`,
    url,
    ctx
  );
};

export const sendReactionPushNotifications = async (
  message: string,
  receiverUserId: string,
  url: string,
  ctx: TRPCContext
) => {
  const receiverUser = await ctx.prisma.user.findUnique({
    where: { id: receiverUserId },
    include: { subscriptions: true },
  });

  if (!receiverUser)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Cannot send push notification to user with id: ${receiverUserId}, because user doesn't exist.`,
    });

  console.log("Sending reaction push notifications.");
  await pushSender(receiverUser.subscriptions, message, url, ctx);
};

const pushSender = async (
  subscriptions: Subscription[],
  message: string,
  url: string,
  ctx: TRPCContext
) => {
  let sent = 0;
  let errors = 0;

  const notificationPromises = subscriptions.map((userSub) =>
    ctx.webPush
      .sendNotification(
        userSub.sub!,
        JSON.stringify({
          title: "You've got time",
          body: message,
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

  console.log(`Push notifications sent to ${sent} devices, rejected: ${errors} devices.`);
};

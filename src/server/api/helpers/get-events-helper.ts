import { Prisma } from "@prisma/client";

import { EventFilterType } from "../../../types";
import { TRPCContext } from "../trpc";

export function getEventsWhereClause(
  eventFilters: EventFilterType[],
  ctx: TRPCContext
): Prisma.EventWhereInput {
  const userId = ctx.session?.user.id;

  if (eventFilters.length === 0) {
    return {
      OR: [{ ownerId: userId }, { invitedUserIds: { has: userId } }, { public: true }],
      untilDate: { gte: new Date() },
    };
  }

  if (eventFilters.length === 1 && eventFilters.includes("past")) {
    return {
      OR: [{ ownerId: userId }, { invitedUserIds: { has: userId } }, { public: true }],
    };
  }

  return {
    OR: [
      { ownerId: eventFilters.includes("own") ? userId : undefined },
      { invitedUserIds: eventFilters.includes("invited") ? { has: userId } : undefined },
      { public: eventFilters.includes("public") ? true : undefined },
    ],
    untilDate: !eventFilters.includes("past") ? { gte: new Date() } : undefined,
  };
}

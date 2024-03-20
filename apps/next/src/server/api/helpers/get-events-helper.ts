import { Prisma } from "@ygt/db";

import { EventFilterType } from "../../../types";
import { TRPCContext } from "../trpc";

export function getEventsWhereClause(
  eventFilters: EventFilterType[],
  ctx: TRPCContext
): Prisma.EventWhereInput {
  const userId = ctx.session?.user.id;
  const showOwn = eventFilters.includes("own");
  const showInvited = eventFilters.includes("invited");
  const showPublic = eventFilters.includes("public");
  const showPast = eventFilters.includes("past");

  if (eventFilters.length === 0) {
    return {
      OR: [
        { ownerId: userId }, // owner sees own unpublished as well
        { invitedUserIds: { has: userId }, published: true },
        { public: true, published: true },
      ],
      untilDate: { gte: new Date() },
    };
  }

  if (eventFilters.length === 1 && showPast) {
    return {
      OR: [
        { ownerId: userId }, // owner sees own unpublished as well
        { invitedUserIds: { has: userId }, published: true },
        { public: true, published: true },
      ],
    };
  }

  const orClause: Prisma.Enumerable<Prisma.EventWhereInput> = [];

  if (showOwn) {
    orClause.push({ ownerId: userId });
  }

  if (showInvited) {
    orClause.push({ invitedUserIds: { has: userId }, published: true });
  }

  if (showPublic) {
    orClause.push({ public: true, published: true });
  }

  return {
    OR: orClause,
    untilDate: !showPast ? { gte: new Date() } : undefined,
  };
}

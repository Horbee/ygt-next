import { attachmentRouter } from "./routers/attachment"
import { availabilityRouter } from "./routers/availability"
import { eventRouter } from "./routers/event"
import { notificationRouter } from "./routers/notification"
import { userRouter } from "./routers/user"
import { createTRPCRouter } from "./trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  event: eventRouter,
  availability: availabilityRouter,
  attachment: attachmentRouter,
  user: userRouter,
  notification: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

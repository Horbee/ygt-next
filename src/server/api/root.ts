import { attachmentRouter } from './routers/attachment'
import { eventRouter } from './routers/event'
import { userRouter } from './routers/user'
import { createTRPCRouter } from './trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  event: eventRouter,
  attachment: attachmentRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

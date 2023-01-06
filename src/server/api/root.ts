import { createTRPCRouter } from "./trpc";
import { regionsRouter } from "./routers/regions";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  regions: regionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

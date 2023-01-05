import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
// import { prisma } from "../prisma";

export const newsRouter = createTRPCRouter({
  //   const averages = await prisma.rating.groupBy({
  //     by: ["regin"],
  //     _avg: {
  //         rating: true
  //     },
  //     orderBy: {
  //         entryId: "desc"
  //     }
  // })
  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.news.findMany();
  // }),
  all: publicProcedure
    .input(
      z.object({
        to_date: z.date(),
        from_date: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      // console.log(input);
      // return { hello: "bye" };
      const x = await ctx.prisma.news.groupBy({
        by: ["region"],
        // where: {
        //   date: {
        //     gte: input.from_date.toISOString(),
        //     lte: input.to_date.toISOString(),
        //   },
        // },
        // orderBy: {
        //   date: "desc",
        // },
      });
      return x;
    }),
});

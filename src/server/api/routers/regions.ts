import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
// import { prisma } from "../prisma";

export type Region = {
  region: string;
  score: number;
};

export const regionsRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z.object({
        to_date: z.date(),
        from_date: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const regionsLabelCounts = await ctx.prisma.news.groupBy({
        by: ["region", "label"],
        _count: {
          label: true,
        },
        where: {
          date: {
            gte: input.from_date,
            lte: input.to_date,
          },
        },
      });

      const regions = new Set(regionsLabelCounts.map((x) => x.region));

      const regionsScores: Region[] = [];
      for (const region of regions) {
        let labelCounts = new Map(
          regionsLabelCounts
            .filter((x) => x.region === region)
            .map((x) => [x.label, x._count.label])
        );

        const regionScore: Region = {
          region: region,
          score:
            (labelCounts.get("NEG") || 0) /
            ((labelCounts.get("POS") || 0) + (labelCounts.get("NEU") || 0)),
        };

        regionsScores.push(regionScore);
      }
      console.log(regionsScores);
      return regionsScores;
    }),
});

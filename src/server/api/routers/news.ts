import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export type RegionSentiment = {
  region: string;
  score: number;
};

export const newsRouter = createTRPCRouter({
  sentimentPerRegion: publicProcedure
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

      console.log(input.from_date);
      console.log(input.to_date);
      console.log(regionsLabelCounts);

      const regions = new Set(regionsLabelCounts.map((x) => x.region));

      const regionsScores: RegionSentiment[] = [];
      for (const region of regions) {
        const labelCounts = new Map(
          regionsLabelCounts
            .filter((x) => x.region === region)
            .map((x) => [x.label, x._count.label])
        );

        const regionScore: RegionSentiment = {
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

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany()
  }),

  create: protectedProcedure
    .input(z.object({
      address: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.upsert({
        where: { id: input.address },
        update: { address: input.address },
        create: { id: input.address, address: input.address },
      })
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

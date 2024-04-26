import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const communityRouter = createTRPCRouter({

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.community.findMany()
  }),

  // getOne: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.community.findUnique({
  //     where: {
  //       id: '123'
  //     }
  //   })
  // }),

  // create: protectedProcedure
  //   .input(z.object({
  //     address: z.string().min(1),
  //   }))
  //   .mutation(async ({ ctx, input }) => {
  //     return ctx.db.community.upsert({
  //       where: { id: input.address },
  //       update: { address: input.address },
  //       create: { id: input.address, address: input.address },
  //     })
  //   }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      image: z.string().optional(),
      owner: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {

      return ctx.db.community.create({
        data: {
          name: input.name,
          description: input.description,
          image: input.image,
          owner: input.owner,
        },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

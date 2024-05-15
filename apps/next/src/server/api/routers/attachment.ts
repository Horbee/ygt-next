import { z } from "zod";

import { TRPCError } from "@trpc/server";

import { CreateAttachment } from "../../dto/create-attachment.dto";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "../../../env/server.mjs";

export const attachmentRouter = createTRPCRouter({
  getAttachments: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.attachment.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
    });
  }),

  deleteAttachment: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: id, ctx }) => {
      const attachment = await ctx.prisma.attachment.delete({
        where: {
          id_ownerId: { id, ownerId: ctx.session.user.id },
        },
      });

      if (!attachment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Attachment not found.",
        });
      }

      await ctx.cloudinary.deleteImage(attachment.publicId);

      return attachment.id;
    }),

  createAttachment: protectedProcedure
    .input(CreateAttachment)
    .mutation(async ({ input, ctx }) => {
      const extension = input.fileName.split(".").pop();
      const userId = ctx.session.user.id;
      const randomStringName = (Math.random() + 1).toString(36).substring(2);
      const publicId = `${userId}/${randomStringName}`;
      const url = `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}.${extension}`;

      await ctx.prisma.attachment.create({
        data: {
          type: input.fileType,
          name: input.fileName,
          url,
          publicId,
          ownerId: ctx.session.user.id,
        },
      });

      // Cloudinary presigned url generation
      const timestamp = Math.round(new Date().getTime() / 1000);

      const signature = ctx.cloudinary.utils.api_sign_request(
        {
          timestamp: timestamp,
          eager: "w_400,h_300,c_pad|w_260,h_200,c_crop",
          public_id: publicId,
        },
        env.CLOUDINARY_API_SECRET
      );

      const postUrl = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`;

      return { signature, timestamp, publicId, postUrl };
    }),
});

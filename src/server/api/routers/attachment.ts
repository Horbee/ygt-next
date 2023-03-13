import { z } from "zod";

import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";

import { env } from "../../../env/server.mjs";
import { CreateAttachment } from "../../dto/create-attachment.dto";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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

      const command = new DeleteObjectCommand({
        Bucket: env.AWS__BUCKET_NAME,
        Key: attachment.name,
      });

      await ctx.s3.send(command);

      return attachment.id;
    }),

  createAttachment: protectedProcedure
    .input(CreateAttachment)
    .mutation(async ({ input, ctx }) => {
      const command = new PutObjectCommand({
        Bucket: env.AWS__BUCKET_NAME,
        Key: input.fileName,
        ContentType: input.fileType,
      });
      const preSignedUrl = await getSignedUrl(ctx.s3, command, { expiresIn: 5 * 60 });

      const s3FileUrl = `https://${env.AWS__BUCKET_NAME}.s3.${env.AWS__BUCKET_REGION}.amazonaws.com/${input.fileName}`;

      const attachment = await ctx.prisma.attachment.create({
        data: {
          type: input.fileType,
          name: input.fileName,
          url: s3FileUrl,
          ownerId: ctx.session.user.id,
        },
      });

      return { preSignedUrl, attachment };
    }),
});

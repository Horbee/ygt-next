import { z } from "zod";

import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
      const attachments = await ctx.prisma.attachment.findMany({
        where: {
          id,
          ownerId: ctx.session.user.id,
        },
      });

      const command = new DeleteObjectsCommand({
        Bucket: env.AWS__BUCKET_NAME,
        Delete: {
          Objects: attachments.map((a) => ({ Key: a.name })),
        },
      });

      const deleteObjectPromises = attachments.map((a) =>
        ctx.prisma.attachment.delete({
          where: { id: a.id },
        })
      );

      await Promise.all([ctx.s3.send(command), ...deleteObjectPromises]);

      return attachments.length;
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

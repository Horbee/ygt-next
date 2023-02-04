import { z } from 'zod'

import { PrismaClient } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import { Cloudinary } from '../../cloudinary'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const deleteImage = async (
  public_id: string,
  prisma: PrismaClient,
  cloudinary: Cloudinary
) => {
  try {
    await cloudinary.deleteImage(public_id);

    const attachment = await prisma.attachment.delete({
      where: { public_id },
    });

    console.log(`Image file with id: ${attachment.id} deleted`);

    return attachment;
  } catch (err) {
    console.error("Error while deleting image file", err);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Error while deleting image file",
    });
  }
};

export const attachmentRouter = createTRPCRouter({
  uploadImage: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: file, ctx }) => {
      try {
        const data = await ctx.cloudinary.uploadImage(file);

        const attachment = await ctx.prisma.attachment.create({
          data: {
            public_id: data.public_id,
            width: data.width,
            height: data.height,
            format: data.format,
            resource_type: data.resource_type,
            url: data.url,
          },
        });

        console.log(`Image file with id: ${attachment.id} uploaded`);

        return attachment;
      } catch (err) {
        console.error("Error while uploading image file", err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error while uploading image file",
        });
      }
    }),
  deleteImageByPublicId: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: public_id, ctx }) => {
      return await deleteImage(public_id, ctx.prisma, ctx.cloudinary);
    }),
});

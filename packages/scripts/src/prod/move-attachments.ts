#!/usr/bin/env -S pnpx ts-node

import {
  CopyObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { type Attachment, PrismaClient } from "@ygt/db";

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../../../apps/next/.env") });

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});

const s3 = new S3Client({
  region: "eu-central-1",
  credentials: {
    secretAccessKey: process.env.AWS__ACCESS_KEY_SECRET!,
    accessKeyId: process.env.AWS__ACCESS_KEY_ID!,
  },
});

const moveAttachment = async (attachment: Attachment) => {
  const userId = attachment.ownerId;

  const extension = attachment.name.split(".").pop();
  const randomFilename = (Math.random() + 1).toString(36).substring(2);
  const randomFilenameWithExtension = randomFilename + "." + extension;
  const filePath = `${userId}/${randomFilenameWithExtension}`;

  try {
    await s3.send(
      new CopyObjectCommand({
        Bucket: process.env.AWS__BUCKET_NAME,
        CopySource: process.env.AWS__BUCKET_NAME + "/" + attachment.name,
        Key: filePath,
      })
    );

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS__BUCKET_NAME,
        Key: attachment.name,
      })
    );

    const newUrl = `https://${process.env.AWS__BUCKET_NAME}.s3.${process.env.AWS__BUCKET_REGION}.amazonaws.com/${filePath}`;

    await prisma.attachment.update({
      where: { id: attachment.id },
      data: { url: newUrl },
    });
    console.log("Successfully moved attachment: " + attachment.id);
  } catch (error) {
    console.error("Error while moving attachment: " + attachment.id);
  }
};

const main = async () => {
  const attachments = await prisma.attachment.findMany();
  console.log("Attachment count: " + attachments.length);

  for await (const attachment of attachments) {
    console.log("Moving attachment: " + attachment.id);
    await moveAttachment(attachment);
  }

  process.exit(0);
};

main();

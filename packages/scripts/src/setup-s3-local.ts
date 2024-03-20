#!/usr/bin/env -S pnpx ts-node

import {
  S3Client,
  CreateBucketCommand,
  PutBucketCorsCommand,
} from "@aws-sdk/client-s3";

import path from "path";

import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../../../apps/next/.env") });

export const s3 = new S3Client({
  endpoint: "http://localhost:4566",
  forcePathStyle: true,
});

const createBucket = async () => {
  try {
    const bucketName = process.env.AWS__BUCKET_NAME;
    if (!bucketName)
      throw new Error("Bucket name is not specified in the .env file!");

    await s3.send(
      new CreateBucketCommand({
        Bucket: bucketName,
      })
    );

    await s3.send(
      new PutBucketCorsCommand({
        Bucket: bucketName,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedHeaders: ["*"],
              AllowedMethods: ["GET", "PUT"],
              AllowedOrigins: ["http://localhost:3000"],
              ExposeHeaders: ["ETag"],
              MaxAgeSeconds: 3600,
            },
          ],
        },
      })
    );
    console.log("YGT local S3 Bucket is setup!");
  } catch (error) {
    console.error("Error while creating local bucket!", error);
  }
};

createBucket();

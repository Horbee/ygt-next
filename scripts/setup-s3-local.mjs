#!/usr/bin/env node

import { S3Client, CreateBucketCommand, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

export const s3 = new S3Client({
  endpoint: "http://localhost:4566",
  forcePathStyle: true,
});

const createBucket = async () => {
  try {
    const bucketName = process.env.AWS__BUCKET_NAME;
    if (!bucketName) throw new Error("Bucket name is not specified in the .env file!");

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
  } catch (error) {
    console.error("Error while creating local bucket!", error);
  }
};

createBucket();

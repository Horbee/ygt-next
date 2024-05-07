import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "../env/server.mjs";

export async function getPresignedImageUrl(
  url: string,
  s3: S3Client,
  expiresIn: number = 60
) {
  const command = new GetObjectCommand({
    Bucket: env.AWS__BUCKET_NAME,
    Key: url,
  });
  return getSignedUrl(s3, command, { expiresIn });
}

import { S3Client } from "@aws-sdk/client-s3";

import { env } from "../env/server.mjs";

export const s3 = new S3Client({
  region: "eu-central-1",
  credentials: {
    secretAccessKey: env.AWS__ACCESS_KEY_SECRET,
    accessKeyId: env.AWS__ACCESS_KEY_ID,
  },
});

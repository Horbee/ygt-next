import S3 from "aws-sdk/clients/s3";

import { env } from "../env/server.mjs";

export const s3 = new S3({
  signatureVersion: "v4",
  region: "eu-central-1",
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_ACCESS_KEY_SECRET,
});

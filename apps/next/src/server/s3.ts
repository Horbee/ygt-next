import { S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";

import { env } from "../env/server.mjs";

const useLocalstackS3 =
  (!!env.AWS__ACCESS_KEY_ID && !!env.AWS__ACCESS_KEY_SECRET) ||
  env.NODE_ENV === "development";

const s3Config: S3ClientConfig = useLocalstackS3
  ? {
      endpoint: "http://localhost:4566",
      forcePathStyle: true,
    }
  : {
      region: "eu-central-1",
      credentials: {
        secretAccessKey: env.AWS__ACCESS_KEY_SECRET,
        accessKeyId: env.AWS__ACCESS_KEY_ID,
      },
    };

export const s3 = new S3Client(s3Config);

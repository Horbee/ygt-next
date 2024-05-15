import { v2 } from "cloudinary";

import { env as serverEnv } from "../env/server.mjs";
import { env as clientEnv } from "../env/client.mjs";

import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

v2.config({
  cloud_name: serverEnv.CLOUDINARY_CLOUD_NAME,
  api_key: clientEnv.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: serverEnv.CLOUDINARY_API_SECRET,
  secure: true,
});

export const cloudinary = {
  deleteImage: async (
    publicId: string
  ): Promise<UploadApiResponse | UploadApiErrorResponse> => {
    return new Promise((resolve, reject) => {
      return v2.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  },
  utils: v2.utils,
};

export type Cloudinary = typeof cloudinary;

import { v2 } from 'cloudinary'
import { Readable } from 'stream'

import { env } from '../env/server.mjs'

import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const cloudinary = {
  uploadImage: async (
    file: string
  ): Promise<UploadApiResponse | UploadApiErrorResponse> => {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result!);
      });

      Readable.from(file).pipe(upload);
    });
  },
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
};

export type Cloudinary = typeof cloudinary;

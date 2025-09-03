import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Uploads an image file to Cloudinary.
   * @param file This is the file object provided by NestJS's FileInterceptor (Express.Multer.File).
   * @returns A Promise that resolves with the details of the uploaded file from Cloudinary.
   */
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        (error, result) => {
          // This callback is executed when the upload is complete.
          if (error) {
            return reject(error);
          }
          // The result can be undefined in some edge cases. If so, we reject the promise.
          if (!result) {
            return reject(new Error('Cloudinary upload failed: No result returned.'));
          }
          resolve(result);
        },
      );
      // The 'file.buffer' contains the actual image data. We convert this buffer
      // into a readable stream and then pipe it to the Cloudinary upload stream.
      toStream(file.buffer).pipe(upload);
    });
  }
}


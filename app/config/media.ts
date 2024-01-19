import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

class Media {
  private readonly _upload;
  private readonly _storage;

  constructor() {
    this._upload = multer({ storage: multer.memoryStorage() });
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    this._storage = cloudinary;
  }

  get upload() {
    return this._upload;
  }

  get storage() {
    return this._storage;
  }
}

export default new Media();

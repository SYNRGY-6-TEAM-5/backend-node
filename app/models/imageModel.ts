import { Model } from 'objection';
import database from '../config/database';

Model.knex(database);

export interface IImage {
  image_id: string;
  name_image?: string;
  url_image?: string;
}

class Image extends Model {
  static get tableName(): string {
    return 'image';
  }

  static get idColumn(): string {
    return 'image_id';
  }

  static get timestamps() {
    return false; // Set to true if you want Objection to handle timestamps automatically
  }

  static get jsonSchema(): object {
    return {
      type: 'object',
      required: ['image_id', 'name_image', 'url_image'],
      properties: {
        image_id: { type: 'string', format: 'uuid' },
        name_image: { type: 'string' },
        url_image: { type: 'string' }
      }
    };
  }
}

export default Image;

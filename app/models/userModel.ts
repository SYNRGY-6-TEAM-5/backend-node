import { Model } from 'objection';
import database from '../config/database';

Model.knex(database);

export interface IUser {
  user_id: string; // Assuming it's a UUID
  is_active?: boolean;
  bitrh_date?: Date;
  phone_num?: string;
  image_id?: string; // Assuming it's a UUID
  role_id?: string; // Assuming it's a UUID
  email_address?: string;
  fullname?: string;
  password?: string;
}

class User extends Model {
  created_at: string | undefined;
  last_modified: string | undefined;

  static get tableName(): string {
    return 'users';
  }

  static get idColumn(): string {
    return 'user_id';
  }

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.last_modified = new Date().toISOString();
  }

  static get timestamps() {
    return false; // Set to true if you want Objection to handle timestamps automatically
  }

  static get jsonSchema(): object {
    return {
      type: 'object',
      required: ['user_id', 'email_address', 'password', 'role'],
      properties: {
        is_active: { type: 'boolean' },
        bitrh_date: { type: 'string', format: 'date-time' },
        created_at: { type: 'string', format: 'date-time' },
        last_modified: { type: 'string', format: 'date-time' },
        phone_num: { type: 'integer' },
        image_id: { type: 'string', format: 'uuid' },
        role_id: { type: 'string', format: 'uuid' },
        user_id: { type: 'string', format: 'uuid' },
        email_address: { type: 'string', minLength: 1, maxLength: 255 },
        fullname: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 255 },
      }
    };
  }
}

export default User;

import { Model, RelationMappings } from 'objection';
import database from '../config/database';
import Role from './roleModel';

Model.knex(database);

export interface IUser {
  user_id: string; // Assuming it's a UUID
  is_active?: boolean;
  bitrh_date?: string;
  phone_num?: string;
  image_id?: string; // Assuming it's a UUID
  role_id?: string; // Assuming it's a UUID
  email_address?: string;
  fullname?: string;
  password?: string;
}

class User extends Model {
  created_at!: string;
  last_modified!: string;
  user_id!: string;
  email_address!: string;
  is_active?: boolean;
  bitrh_date?: string;
  phone_num?: string;
  image_id?: string;
  role_id?: string;
  fullname?: string;
  password?: string;

  static get tableName(): string {
    return 'users';
  }

  static get idColumn(): string {
    return 'user_id';
  }

  static get relationMappings(): RelationMappings {
    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'users.role_id',
          to: 'role.role_id'
        }
      }
    };
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
      required: ['user_id', 'email_address', 'role_id'],
      properties: {
        user_id: { type: 'string', format: 'uuid' },
        bitrh_date: { type: 'string' },
        phone_num: { type: 'integer' },
        image_id: { type: 'string', format: 'uuid' },
        role_id: { type: 'string', format: 'uuid' },
        email_address: { type: 'string', minLength: 1, maxLength: 255 },
        fullname: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 255 }
      }
    };
  }
}

export default User;

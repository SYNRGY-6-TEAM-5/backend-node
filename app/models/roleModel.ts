import { Model } from 'objection';
import database from '../config/database';

Model.knex(database);

export interface IRole {
  role_id: string;
  role_name: string;
}

class Role extends Model {
  role_id!: string;
  role_name!: string;

  static get tableName() {
    return 'role';
  }

  static get idColumn() {
    return 'role_id';
  }

  static get jsonSchema(): object {
    return {
      type: 'object',
      required: ['role_id', 'role_name'],
      properties: {
        role_id: { type: 'string', format: 'uuid' },
        role_name: { type: 'string' }
      }
    };
  }
}

export default Role;

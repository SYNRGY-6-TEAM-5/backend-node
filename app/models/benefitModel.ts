import { Model } from 'objection';
import database from '../config/database';


Model.knex(database);

export interface IBenefit {
  benefit_id: number;
  flight_id: number;
  name: string;
  detail: string;
}

class Benefit extends Model {
  static get tableName(): string {
    return 'benefit';
  }

  static get idColumn(): string {
    return 'benefit_id';
  }

  $beforeInsert() {
    // @ts-expect-error
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    // @ts-expect-error
    this.updated_at = new Date().toISOString();
  }

  static get timestamps() {
    return true;
  }

  static get jsonSchema(): object {
    return {
      type: 'object',
      required: [
        'flight_id',
        'name',
        'detail',
      ],
      properties: {
        benefit_id: { type: 'integer' },
        flight_id: { type: 'integer' },
        name: { type: 'string', minLength: 4, maxLength: 50 },
        detail: { type: 'string', minLength: 4 }
      }
    };
  }
}

export default Benefit;

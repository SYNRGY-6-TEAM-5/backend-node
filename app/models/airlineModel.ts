import { Model } from 'objection';
import database from '../config/database';


Model.knex(database);

export interface IAirline {
  airline_id: number;
  name: string;
  iata: string;
  image: string;
}

class Airline extends Model {
  static get tableName(): string {
    return 'airline';
  }

  static get idColumn(): string {
    return 'airline_id';
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
        'name',
        'iata',
        'image',
      ],
      properties: {
        airline_id: { type: 'integer' },
        name: { type: 'string', minLength: 3, maxLength: 50 },
        iata: { type: 'string', minLength: 1, maxLength: 2 },
        image: { type: 'string', minLength: 5 }
      }
    };
  }
}

export default Airline;

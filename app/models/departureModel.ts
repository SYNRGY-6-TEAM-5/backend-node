import { Model } from 'objection';
import database from '../config/database';
import Airport from './airportModel';

Model.knex(database);

export interface IDeparture {
  departure_id: number;
  airport_id: number;
  terminal: string;
  scheduled_time: string;
}

class Departure extends Model {
  static get tableName(): string {
    return 'departure';
  }

  static get idColumn(): string {
    return 'departure_id'; // Specify the actual primary key column name here
  }

  static get relationMappings() {
    return {
      airport_details: {
        relation: Model.BelongsToOneRelation,
        modelClass: Airport,
        join: {
          from: 'departure.airport_id',
          to: 'airport.airport_id',
        }
      },
    };
  }

  static get modifiers() {
    return {
      selectAirportDetails(builder: any) {
        builder.select('*');
      },
    };
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
        'airport_id',
        'terminal',
        'scheduled_time',
      ],
      properties: {
        departure_id: { type: 'integer' },
        airport_id: { type: 'integer' },
        terminal: { type: 'string', minLength: 1, maxLength: 10 },
        scheduled_time: { type: 'string'},
      }
    };
  }
}

export default Departure;
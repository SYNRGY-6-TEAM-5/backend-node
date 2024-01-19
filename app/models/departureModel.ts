import { Model } from 'objection';
import database from '../config/database';
import Airport from './airportModel';

Model.knex(database);

export interface IDeparture {
  departure_id: number;
  airport_id: number;
  airport: string;
  timezone: string;
  terminal: string;
  gate: string;
  delay: number;
  iata: string;
  icao: string;
  scheduled_time: string;
  estimated_time: string;
  actual_time: string;
  created_by: number;
  updated_by: number;
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
        'airport',
        'timezone',
        'terminal',
        'gate',
        'delay',
        'iata',
        'icao',
        'scheduled_time',
        'created_by',
        'updated_by'
      ],
      properties: {
        Departure_id: { type: 'integer' },
        airport_id: { type: 'number' },
        airport: { type: 'string', minLength: 1, maxLength: 20 },
        timezone: { type: 'string', minLength: 1, maxLength: 20 },
        terminal: { type: 'string' },
        gate: { type: 'string', minLength: 1, maxLength: 10 },
        delay: { type: 'number' },
        iata: { type: 'string', minLength: 1, maxLength: 5 },
        icao: { type: 'string', minLength: 1, maxLength: 5 },
        scheduled_time: { type: 'string' },
        created_by: { type: 'integer' },
        updated_by: { type: 'integer' },
      }
    };
  }
}

export default Departure;
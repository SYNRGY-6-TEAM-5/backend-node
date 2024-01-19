import { Model } from 'objection';
import database from '../config/database';

import Departure from './departureModel';
import Arrival from './arrivalModel';
import Airline from './airlineModel';

Model.knex(database);

export interface IFlight {
  flight_id: number;
  departure_id: number;
  arrival_id: number;
  airline_id: number;
  flight_status: number;
  flight_date: Date;
  flight_number: string;
  iata: string;
  icao: string;
  created_by: number;
  updated_by: number;
}

class Flight extends Model {
  static get tableName(): string {
    return 'flight';
  }

  static get idColumn(): string {
    return 'flight_id'; // Specify the actual primary key column name here
  }


  static get relationMappings() {
    return {
      departure: {
        relation: Model.BelongsToOneRelation,
        modelClass: Departure,
        join: {
          from: 'flight.departure_id',
          to: 'departure.departure_id',
        },
      },
      arrival: {
        relation: Model.BelongsToOneRelation,
        modelClass: Arrival,
        join: {
          from: 'flight.arrival_id',
          to: 'arrival.arrival_id',
        },
      },
      airline: {
        relation: Model.BelongsToOneRelation,
        modelClass: Airline,
        join: {
          from: 'flight.airline_id',
          to: 'airline.airline_id',
        },
      },
      aircraft: {
        relation: Model.BelongsToOneRelation,
        modelClass: Aircraft,
        join: {
          from: 'flight.aircraft_id',
          to: 'aircraft.aircraft_id',
        },
      },
      live_tracking: {
        relation: Model.BelongsToOneRelation,
        modelClass: LiveTracking,
        join: {
          from: 'flight.live_id',
          to: 'live_tracking.live_id',
        },
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
        'departure_id',
        'arrival_id',
        'airline_id',
        'aircraft_id',
        'live_id',
        'flight_status',
        'flight_date',
        'flight_number',
        'iata',
        'icao',
      ],
      properties: {
        flight_id: { type: 'integer' },
        departure_id: { type: 'integer' },
        arrival_id: { type: 'integer' },
        airline_id: { type: 'integer' },
        aircraft_id: { type: 'integer' },
        live_id: { type: 'integer' },
        flight_status: { type: 'string', minLength: 1, maxLength: 25 },
        flight_date: { type: 'string', format: 'date-time' },
        flight_number: { type: 'string', minLength: 1, maxLength: 25 },
        iata: { type: 'string', minLength: 1, maxLength: 10 },
        icao: { type: 'string', minLength: 1, maxLength: 10 },
        created_by: { type: 'integer' },
        updated_by: { type: 'integer' },
      }
    };
  }
}

export default Flight;
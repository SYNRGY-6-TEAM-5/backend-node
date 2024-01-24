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
  transit: number;
  first_seat: number;
  business_seat: number;
  economy_seat: number;
  flight_status: string;
  flight_number: string;
  iata: string;
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
      }
    };
  }

  static get modifiers() {
    return {
      selectDepartureDetails(builder: any) {
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
        'departure_id',
        'arrival_id',
        'airline_id',
        'transit',
        'first_seat',
        'business_seat',
        'economy_seat',
        'flight_status',
        'flight_number',
        'iata',
      ],
      properties: {
        flight_id: { type: 'integer' },
        departure_id: { type: 'integer' },
        arrival_id: { type: 'integer' },
        airline_id: { type: 'integer' },
        
        transit: { type: 'integer' },
        first_seat: { type: 'integer' },
        business_seat: { type: 'integer' },
        economy_seat: { type: 'integer' },
        flight_status: { type: 'string', minLength: 1, maxLength: 10 },
        flight_number: { type: 'string' },
        iata: { type: 'string' },
      }
    };
  }
}

export default Flight;
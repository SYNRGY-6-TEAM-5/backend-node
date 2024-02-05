import { Model } from 'objection';
import database from '../config/database';

import Booking from './bookingModel';

Model.knex(database);

export interface IPassenger {
  passenger_id: number;
  booking_id: number;
  NIK: string;
  name: string;
  date_of_birth: Date;
  courtesy_title: string;
  vaccinated: boolean;
  created_at: number;
  updated_at: number;
}

class Passenger extends Model {
  passenger_id: any;
  static get tableName(): string {
    return 'passenger_details';
  }

  static get idColumn(): string {
    return 'passenger_id';
  }

  static get relationMappings() {
    return {
      booking: {
        relation: Model.BelongsToOneRelation,
        modelClass: Booking,
        join: {
          from: 'passenger_details.booking_id',
          to: 'booking.booking_id',
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
        'booking_id',
        'NIK',
        'name',
        'date_of_birth',
        'vaccinated'
      ],
      properties: {
        passenger_id: { type: 'integer' },
        booking_id: { type: 'integer' },
        NIK: { type: 'string' },
        name: { type: 'string' },
        date_of_birth: { type: 'string' },
        courtesy_title: { type: 'string' },
        vaccinated: { type: 'boolean' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      }
    };
  }
}

export default Passenger;
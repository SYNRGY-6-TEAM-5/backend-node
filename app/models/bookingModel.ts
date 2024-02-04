import { Model } from 'objection';
import database from '../config/database';

import User from './userModel';

Model.knex(database);

export interface IBooking {
  booking_id: number;
  user_id: string;
  trip_type: string;
  total_passenger: number;
  expired_time: Date;
  total_amount: number;
  full_protection: boolean;
  bag_insurance: boolean;
  flight_delay: boolean;
  payment_method: string;
  status: string;
}

class Booking extends Model {
  static get tableName(): string {
    return 'booking';
  }

  static get idColumn(): string {
    return 'booking_id';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'booking.user_id',
          to: 'user.user_id',
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
        'user_id',
        'trip_type',
        'total_passenger',
        'expired_time',
        'total_amount',
        'full_protection',
        'bag_insurance',
        'flight_delay',
        'payment_method',
        'status'
      ],
      properties: {
        booking_id: { type: 'integer' },
        user_id: { type: 'string' },
        trip_type: { type: 'string' },
        total_passenger: { type: 'integer' },
        expired_time: { type: 'string' },
        total_amount: { type: 'integer' },
        full_protection: { type: 'boolean' },
        bag_insurance: { type: 'boolean' },
        flight_delay: { type: 'boolean' },
        payment_method: { type: 'string' },
        status: { type: 'string' },
      }
    };
  }
}

export default Booking;
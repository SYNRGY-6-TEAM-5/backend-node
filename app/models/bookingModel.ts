import { Model } from 'objection';
import database from '../config/database';

import User from './userModel';
import Passenger from './passengerModel';
import MapTicket from './mapTicketModel';

Model.knex(database);

export interface IBooking {
  booking_id: number;
  user_id: string;
  booking_code: string;
  total_passenger: number;
  expired_time: Date;
  total_amount: number;
  full_protection: boolean;
  bag_insurance: boolean;
  flight_delay: boolean;
  payment_method: string;
  status: string;
  external_id: string;
  payment_id: string;
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
      passengers: {
        relation: Model.HasManyRelation,
        modelClass: Passenger,
        join: {
          from: 'booking.booking_id',
          to: 'passenger_details.booking_id',
        },
      },
      map_ticket: {
        relation: Model.HasManyRelation,
        modelClass: MapTicket,
        join: {
          from: 'booking.booking_id',
          to: 'map_ticket.booking_id',
        },
      },
    };
  }

  static get modifiers() {
    return {
      selectPassengerDetails(builder: any) {
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
        'user_id',
        'booking_code',
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
        booking_code: { type: 'string' },
        total_passenger: { type: 'integer' },
        expired_time: { type: 'string' },
        total_amount: { type: 'integer' },
        full_protection: { type: 'boolean' },
        bag_insurance: { type: 'boolean' },
        flight_delay: { type: 'boolean' },
        payment_method: { type: 'string' },
        status: { type: 'string' },
        external_id: { type: 'string' },
        payment_id: { type: 'string' },
      }
    };
  }
}

export default Booking;
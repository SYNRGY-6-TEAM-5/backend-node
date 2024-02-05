import { Model } from 'objection';
import database from '../config/database';

import Booking from './bookingModel';

Model.knex(database);

export interface IContactDetails {
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

class ContactDetails extends Model {
  static get tableName(): string {
    return 'contact_details';
  }

  static get idColumn(): string {
    return 'contact_id';
  }

  static get relationMappings() {
    return {
      booking: {
        relation: Model.BelongsToOneRelation,
        modelClass: Booking,
        join: {
          from: 'contact_details.booking_id',
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
        'fullName',
        'email',
        'phone'
      ],
      properties: {
        contact_id: { type: 'integer' },
        booking_id: { type: 'integer' },
        fullName: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      }
    };
  }
}

export default ContactDetails;
import { Model } from 'objection';
import database from '../config/database';

import Booking from './bookingModel';
import Ticket from './ticketModel';

Model.knex(database);

export interface IMapTicket {
  map_ticket_id: number;
  booking_id: number;
  ticket_id: number;
}

class MapTicket extends Model {
  static get tableName(): string {
    return 'map_ticket';
  }

  static get idColumn(): string {
    return 'map_ticket_id';
  }

  static get relationMappings() {
    return {
      booking: {
        relation: Model.BelongsToOneRelation,
        modelClass: Booking,
        join: {
          from: 'map_ticket.booking_id',
          to: 'booking.booking_id',
        },
      },
      ticket: {
        relation: Model.BelongsToOneRelation,
        modelClass: Ticket,
        join: {
          from: 'map_ticket.ticket_id',
          to: 'ticket.ticket_id',
        },
      },
    };
  }

  static get jsonSchema(): object {
    return {
      type: 'object',
      required: [
        'booking_id',
        'ticket_id',
      ],
      properties: {
        map_ticket_id: { type: 'integer' },
        booking_id: { type: 'integer' },
        ticket_id: { type: 'number' },
      }
    };
  }
}

export default MapTicket;
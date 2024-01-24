import { Model } from 'objection';
import database from '../config/database';

import Flight from './flightModel';

Model.knex(database);

export interface ITicket {
  ticket_id: number;
  flight_id: number;
  ticket_type: string;
  ticket_amount: number;
  fare_amount: string;
  valid_until: Date;
}

class Ticket extends Model {
  flight_id!: number;
  flight: any;
  static get tableName(): string {
    return 'ticket';
  }

  static get idColumn(): string {
    return 'ticket_id'; // Specify the actual primary key column name here
  }

  static get relationMappings() {
    return {
      flight: {
        relation: Model.BelongsToOneRelation,
        modelClass: Flight,
        join: {
          from: 'ticket.flight_id',
          to: 'flight.flight_id',
        },
      }
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
        'flight_id',
        'ticket_type',
        'ticket_amount',
        'fare_amount',
        'valid_until'
      ],
      properties: {
        ticket_id: { type: 'integer' },
        flight_id: { type: 'integer' },
        ticket_type: { type: 'string' },
        ticket_amount: { type: 'integer' },
        fare_amount: { type: 'string' },
        valid_until: { type: 'string' }
      }
    };
  }
}

export default Ticket;
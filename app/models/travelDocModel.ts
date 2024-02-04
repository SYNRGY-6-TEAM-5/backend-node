import { Model } from 'objection';
import database from '../config/database';


Model.knex(database);

export interface ITravelDoc {
  travel_doc_id: number;
  passenger_id: number;
  doc_type: string;
  nationality: string;
  doc_number: string;
  expired_date: string;
  file: string;
  valid: boolean;
}

class TravelDoc extends Model {
  static get tableName(): string {
    return 'travel_docs';
  }

  static get idColumn(): string {
    return 'travel_doc_id';
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
        'passenger_id',
        'doc_type',
        'nationality',
        'doc_number',
        'expired_date',
        'file'
      ],
      properties: {
        travel_doc_id: { type: 'integer' },
        passenger_id: { type: 'integer' },
        doc_type: { type: 'string' },
        nationality: { type: 'string' },
        doc_number: { type: 'string' },
        expired_date: { type: 'string' },
        file: { type: 'string' },
        valid: { type: 'boolean' }
      }
    };
  }
}

export default TravelDoc;

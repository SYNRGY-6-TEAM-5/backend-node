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

class SavedTravelDoc extends Model {
  static get tableName(): string {
    return 'saved_travel_docs';
  }

  static get idColumn(): string {
    return 'saved_travel_docs_id';
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
        'saved_passenger_id',
        'doc_type',
        'nationality',
        'doc_number',
        'expired_date',
        'file'
      ],
      properties: {
        saved_travel_docs_id: { type: 'integer' },
        saved_passenger_id: { type: 'integer' },
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

export default SavedTravelDoc;

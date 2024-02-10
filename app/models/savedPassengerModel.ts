import { Model } from 'objection';
import database from '../config/database';

import Booking from './bookingModel';
import TravelDoc from './travelDocModel';
import PassengerAddon from './addOnsModel';
import User from './userModel';
import SavedTravelDoc from './savedTravelDocModel';

Model.knex(database);

export interface ISavedPassenger {
  saved_passenger_id: number;
  user_id: string;
  id: string;
  nik: string;
  name: string;
  date_of_birth: Date;
  courtesy_title: string;
  vaccinated: boolean;
  created_at: number;
  updated_at: number;
}

class SavedPassenger extends Model {
  passenger_id: any;
  static get tableName(): string {
    return 'saved_passenger_details';
  }

  static get idColumn(): string {
    return 'saved_passenger_id';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'saved_passenger_details.user_id',
          to: 'users.user_id',
        },
      },
      travel_docs: {
        relation: Model.HasManyRelation,
        modelClass: SavedTravelDoc,
        join: {
          from: 'saved_passenger_details.saved_passenger_id',
          to: 'saved_travel_docs.saved_passenger_id',
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
        'nik',
        'id',
        'name',
        'date_of_birth',
        'vaccinated'
      ],
      properties: {
        saved_passenger_id: { type: 'integer' },
        user_id: { type: 'string', minLength: 1 },
        id: { type: 'string', minLength: 1 },
        nik: { type: 'string', minLength: 1 },
        name: { type: 'string', minLength: 1 },
        date_of_birth: { type: 'string', minLength: 1 },
        courtesy_title: { type: 'string', minLength: 1 },
        vaccinated: { type: 'boolean' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      }
    };
  }
}

export default SavedPassenger;
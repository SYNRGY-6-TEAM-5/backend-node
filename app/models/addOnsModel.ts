import { Model } from 'objection';
import database from '../config/database';

Model.knex(database);

export interface IPassengerAddon {
  addon_id: number;
  passenger_id: number;
  trip_type: string;
  meal_name: string;
  meal_price: number;
  meal_img: string;
  meal_count: number;
  baggage_weight: string;
  baggage_price: number;
}

class PassengerAddon extends Model {
  static get tableName(): string {
    return 'passenger_addons';
  }

  static get idColumn(): string {
    return 'addon_id';
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
        'trip_type',
        'meal_name',
        'meal_price',
        'meal_img',
        'meal_count',
        'baggage_weight',
        'baggage_price'
      ],
      properties: {
        addon_id: { type: 'integer' },
        passenger_id: { type: 'integer' },
        trip_type: { type: 'string', minLength: 1, maxLength: 10 },
        meal_name: { type: 'string', minLength: 1, maxLength: 255 },
        meal_price: { type: 'number' },
        meal_img: { type: 'string', minLength: 1, maxLength: 255 },
        meal_count: { type: 'integer' },
        baggage_weight: { type: 'string', minLength: 1, maxLength: 10 },
        baggage_price: { type: 'number' }
      }
    };
  }
}

export default PassengerAddon;

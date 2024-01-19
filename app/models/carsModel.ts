import { Model } from 'objection';
import database from '../config/database';

Model.knex(database);

export interface ICar {
  car_id: number;
  plate: string;
  manufacture: string;
  image: string;
  model: string;
  type: string;
  description: string;
  transmission: string;
  capacity: number;
  rentPerDay: string;
  availableAt: string;
  available: boolean;
  year: number;
  options: object;
  specs: object;
  created_by: number;
  updated_by: number;
}

class Cars extends Model {
  static get tableName(): string {
    return 'cars';
  }

  static get idColumn(): string {
    return 'car_id'; // Specify the actual primary key column name here
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
        'plate',
        'manufacture',
        'image',
        'model',
        'type',
        'description',
        'transmission',
        'capacity',
        'rentPerDay',
        'availableAt',
        'available',
        'year',
        'options',
        'specs',
        'created_by',
        'updated_by'
      ],
      properties: {
        car_id: { type: 'integer' },
        plate: { type: 'string', minLength: 1, maxLength: 10 },
        manufacture: { type: 'string', minLength: 1, maxLength: 20 },
        image: { type: 'string' },
        model: { type: 'string', minLength: 1, maxLength: 20 },
        type: { type: 'string', minLength: 1, maxLength: 100 },
        description: { type: 'string' },
        transmission: { type: 'string', minLength: 1, maxLength: 20 },
        capacity: { type: 'number' },
        rentPerDay: { type: 'string' },
        availableAt: { type: 'string' },
        available: { type: 'boolean' },
        year: { type: 'number', maxLength: 4 },
        options: { type: 'object' },
        specs: { type: 'object' },
        created_by: { type: 'integer' },
        updated_by: { type: 'integer' }
      }
    };
  }
}

export default Cars;

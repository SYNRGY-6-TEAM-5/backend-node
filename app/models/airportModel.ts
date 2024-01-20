import { Model } from 'objection';
import database from '../config/database';

Model.knex(database);

export interface IAirport {
  airport_id: number;
  airport_name: string;
  iata_code: string;
  gmt: string;
  city_name: string;
  city_iata_code: string;
  country_name: string;
  country_iso_code: string;
}

class Airport extends Model implements IAirport {
  airport_id!: number;
  airport_name!: string;
  iata_code!: string;
  gmt!: string;
  city_name!: string;
  city_iata_code!: string;
  country_name!: string;
  country_iso_code!: string;

  static get tableName(): string {
    return 'airport';
  }

  static get idColumn(): string {
    return 'airport_id'; // Specify the actual primary key column name here
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
        'airport_name',
        'iata_code',
        'gmt',
        'city_name',
        'city_iata_code',
        'country_name',
        'country_iso_code'
      ],
      properties: {
        airport_id: { type: 'integer' },
        airport_name: { type: 'string' },
        iata_code: { type: 'string', minLength: 1, maxLength: 5 },
        gmt: { type: 'string', minLength: 1, maxLength: 5 },
        city_name: { type: 'string', minLength: 1, maxLength: 25 },
        city_iata_code: { type: 'string', minLength: 1, maxLength: 25 },
        country_name: { type: 'string', minLength: 1, maxLength: 25 },
        country_iso_code: { type: 'string', minLength: 1, maxLength: 5 },
      }
    };
  }
}

export default Airport;

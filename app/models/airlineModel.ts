import { Model } from 'objection';
import database from '../config/database';


Model.knex(database);

export interface IAirline {
  airline_id: number;
  name: string;
  iata: string;
  image: string;
}

class Airline extends Model {
  static get tableName(): string {
    return 'airline';
  }

  static get idColumn(): string {
    return 'airline_id';
  }
  

  // static get relationMappings() {
  //   return {
  //     city: {
  //       relation: Model.BelongsToOneRelation,
  //       modelClass: City,
  //       join: {
  //         from: 'airport.city_id',
  //         to: 'city.city_id',
  //       },
  //     },
  //   };
  // }

  // static get modifiers() {
  //   return {
  //     selectCityDetails(builder: any) {
  //       builder.select('city_id', 'city_name', /* other fields you need */);
  //     },
  //   };
  // }

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
        'airline_id',
        'name',
        'iata',
        'image',
      ],
      properties: {
        airline_id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 25 },
        iata: { type: 'string', minLength: 1, maxLength: 5 },
        image: { type: 'string' }
      }
    };
  }
}

export default Airline;

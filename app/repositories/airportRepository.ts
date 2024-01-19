import { Model } from 'objection';
import Airport from "../models/airportModel";

export interface IParams {
  page?: number;
  size?: number;
  search?: string;
}

class AirportRepository {
  create(createArgs: any) {
    return Airport.query().insert(createArgs);
  }

  update(departure_id: number, updateArgs: any) {
    return Airport.query().patchAndFetchById(departure_id, updateArgs);
  }

  delete(departure_id: number) {
    return Airport.query().deleteById(departure_id);
  }

  find(departure_id: number) {
    return Airport.query().findById(departure_id);
  }

  async findAll(params?: IParams): Promise<Array<Airport & { city: { city_name: string } }>> {
    let airportsQuery = Airport.query()

    if (params?.search) {
      airportsQuery = airportsQuery
        .whereILike('airport_name', `%${params?.search}%`)
        .orWhereILike('iata_code', `%${params?.search}%`)
        .orWhereILike('country_name', `%${params?.search}%`)
        .orWhereILike('city_name', `%${params?.search}%`);
    }

    const airports = await airportsQuery.orderBy('created_at', 'desc');

    return airports as Array<Airport & { city: { city_name: string } }>;
  }

  async count(params?: IParams) {
    let allAirports = Airport.query().count('airport_id');

    if (params?.search) {
      allAirports = allAirports
        .whereILike('airport_name', `%${params?.search}%`)
        .orWhereILike('iata_code', `%${params?.search}%`)
        .orWhereILike('country_name', `%${params?.search}%`)
        .orWhereILike('city_name', `%${params?.search}%`);
    }

    return Number(((await allAirports) as unknown as Array<{ count: number }>)[0].count);
  }
}

export default new AirportRepository();


import Airline from "../models/airlineModel";

export interface IParams {
  page?: number;
  size?: number;
  search?: string;
}

class AirlineRepository {
  create(createArgs: any) {
    return Airline.query().insert(createArgs);
  }

  async findAll(params?: IParams): Promise<Array<Airline & { city: { city_name: string } }>> {
    let AirlinesQuery = Airline.query()

    if (params?.search) {
      AirlinesQuery = AirlinesQuery
        .whereILike('name', `%${params?.search}%`)
        .orWhereILike('iata', `%${params?.search}%`);
    }

    const Airlines = await AirlinesQuery.orderBy('created_at', 'desc');

    return Airlines as Array<Airline & { city: { city_name: string } }>;
  }

  find(airline_id: number) {
    return Airline.query().findById(airline_id);
  }

  update(airline_id: number, updateArgs: any) {
    return Airline.query().patchAndFetchById(airline_id, updateArgs);
  }

  delete(airline_id: number) {
    return Airline.query().deleteById(airline_id);
  }

  async count(params?: IParams) {
    let allAirlines = Airline.query().count('airline_id');

    if (params?.search) {
      allAirlines = allAirlines
        .whereILike('name', `%${params?.search}%`)
        .orWhereILike('iata', `%${params?.search}%`);
    }

    return Number(((await allAirlines) as unknown as Array<{ count: number }>)[0].count);
  }
}

export default new AirlineRepository();


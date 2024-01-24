import Departure from "../models/departureModel";

export interface IParams {
  page?: number;
  size?: number;
  search?: string;
}

class DepartureRepository {
  create(createArgs: any) {
    return Departure.query().insert(createArgs);
  }

  find(departure_id: number) {
    return Departure.query().findById(departure_id).withGraphFetched('airport_details');
  }

  async findAll(params?: IParams): Promise<Array<Departure & { airport: { airport_name: string } }>> {
    let departuresQuery = Departure.query()
      .select('departure.*')
      .joinRelated('airport_details')
      .withGraphFetched('airport_details')

    if (params?.search) {
      departuresQuery = departuresQuery
        .whereILike('airport_details.airport_name', `%${params?.search}%`)
        .orWhereILike('airport_details.iata_code', `%${params?.search}%`)
        .orWhereILike('airport_details.city_name', `%${params?.search}%`)
        .orWhereILike('airport_details.country_name', `%${params?.search}%`);
    }

    const departures = await departuresQuery.orderBy('departure.created_at', 'desc');

    return departures as Array<Departure & { airport: { airport_name: string } }>;
  }

  update(departure_id: number, updateArgs: any) {
    return Departure.query().patchAndFetchById(departure_id, updateArgs);
  }

  delete(departure_id: number) {
    return Departure.query().deleteById(departure_id);
  }

  async count(params?: IParams) {
    let countQuery = Departure.query().joinRelated('airport_details');

    if (params?.search) {
      countQuery = countQuery
        .whereILike('airport_details.airport_name', `%${params?.search}%`)
        .orWhereILike('airport_details.iata_code', `%${params?.search}%`)
        .orWhereILike('airport_details.city_name', `%${params?.search}%`)
        .orWhereILike('airport_details.country_name', `%${params?.search}%`);
    }

    const count = await countQuery.resultSize();
    return count;
  }
}

export default new DepartureRepository();

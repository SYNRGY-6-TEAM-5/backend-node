import Arrival, { IArrival } from "../models/arrivalModel";

export interface IParams {
  page?: number;
  size?: number;
  search?: string;
}

class ArrivalRepository {
  create(createArgs: any) {
    return Arrival.query().insert(createArgs);
  }

  find(arrival_id: number) {
    return Arrival.query().findById(arrival_id).withGraphFetched('airport_details');
  }

  async findAll(params?: IParams): Promise<Array<Arrival & { airport: { airport_name: string } }>> {
    let arrivalsQuery = Arrival.query()
      .select('arrival.*')
      .joinRelated('airport_details')
      .withGraphFetched('airport_details')

      if (params?.search) {
        arrivalsQuery = arrivalsQuery
          .whereILike('airport_details.airport_name', `%${params?.search}%`)
          .orWhereILike('airport_details.iata_code', `%${params?.search}%`)
          .orWhereILike('airport_details.city_name', `%${params?.search}%`)
          .orWhereILike('airport_details.country_name', `%${params?.search}%`);
      }

    const arrival = await arrivalsQuery.orderBy('created_at', 'desc');

    return arrival as Array<Arrival & { airport: { airport_name: string } }>;
  }

  update(arrival_id: number, updateArgs: IArrival) {
    console.log("Update Payload >>> ", updateArgs);
    return Arrival.query().patchAndFetchById(arrival_id, updateArgs);
  }

  delete(arrival_id: number) {
    return Arrival.query().deleteById(arrival_id);
  }

  async count(params?: IParams) {
    let countQuery = Arrival.query().joinRelated('airport_details');

    if (params?.search) {
      const searchValue = `%${params.search}%`;
      countQuery = countQuery
        .whereILike('airport_details.airport_name', searchValue)
        .orWhereILike('airport_details.iata_code', searchValue)
        .orWhereILike('airport_details.city_name', searchValue)
        .orWhereILike('airport_details.country_name', searchValue);
    }

    const count = await countQuery.resultSize();
    return count;
  }
}

export default new ArrivalRepository();

import TravelDoc from "../models/travelDocModel";

export interface IParams {
  page?: number;
  size?: number;
  search?: string;
}

class TravelDocRepository {
  create(createArgs: any) {
    return TravelDoc.query().insert(createArgs);
  }

  async findAll(params?: IParams): Promise<Array<TravelDoc>> {
    let travelDocsQuery = TravelDoc.query()

    if (params?.search) {
      travelDocsQuery = travelDocsQuery
        .whereILike('name', `%${params?.search}%`)
        .orWhereILike('iata', `%${params?.search}%`);
    }

    const travelDocs = await travelDocsQuery.orderBy('created_at', 'desc');

    return travelDocs as Array<TravelDoc>;
  }

  find(travel_doc_id: number) {
    return TravelDoc.query().findById(travel_doc_id);
  }

  update(travel_doc_id: number, updateArgs: any) {
    return TravelDoc.query().patchAndFetchById(travel_doc_id, updateArgs);
  }

  delete(travel_doc_id: number) {
    return TravelDoc.query().deleteById(travel_doc_id);
  }

  async count(params?: IParams) {
    let allTravelDocs = TravelDoc.query().count('travel_doc_id');

    if (params?.search) {
      allTravelDocs = allTravelDocs
        .whereILike('name', `%${params?.search}%`)
        .orWhereILike('iata', `%${params?.search}%`);
    }

    return Number(((await allTravelDocs) as unknown as Array<{ count: number }>)[0].count);
  }
}

export default new TravelDocRepository();


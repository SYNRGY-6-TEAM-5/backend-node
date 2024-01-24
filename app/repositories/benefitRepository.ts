import Benefit from "../models/benefitModel";

export interface IParams {
  page?: number;
  size?: number;
  search?: string;
}

class BenefitRepository {
  create(createArgs: any) {
    return Benefit.query().insert(createArgs);
  }

  async findAll(params?: IParams): Promise<Array<Benefit>> {
    let BenefitsQuery = Benefit.query()

    if (params?.search) {
      BenefitsQuery = BenefitsQuery
        .whereILike('name', `%${params?.search}%`)
        .orWhereILike('detail', `%${params?.search}%`);
    }

    const Benefits = await BenefitsQuery.orderBy('created_at', 'desc');

    return Benefits as Array<Benefit>;
  }

  find(benefit_id: number) {
    return Benefit.query().findById(benefit_id);
  }

  findByFlightId(flight_id: number) {
    return Benefit.query()
      .join('benefit as b1', 'b1.benefit_id', '=', 'benefit.benefit_id')
      .where('b1.flight_id', flight_id);
  }

  update(benefit_id: number, updateArgs: any) {
    return Benefit.query().patchAndFetchById(benefit_id, updateArgs);
  }

  delete(benefit_id: number) {
    return Benefit.query().deleteById(benefit_id);
  }

  async count(params?: IParams) {
    let allBenefits = Benefit.query().count('benefit_id');

    if (params?.search) {
      allBenefits = allBenefits
        .whereILike('name', `%${params?.search}%`)
        .orWhereILike('detail', `%${params?.search}%`);
    }

    return Number(((await allBenefits) as unknown as Array<{ count: number }>)[0].count);
  }
}

export default new BenefitRepository();


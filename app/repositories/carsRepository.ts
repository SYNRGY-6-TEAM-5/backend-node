import Cars from '../models/carsModel';

export interface IParams {
  page?: number;
  size?: number;
  search?: string;
}

class CarsRepository {
  create(createArgs: any) {
    return Cars.query().insert(createArgs);
  }

  update(car_id: number, updateArgs: any) {
    return Cars.query().patchAndFetchById(car_id, updateArgs);
  }

  delete(car_id: number) {
    return Cars.query().deleteById(car_id);
  }

  find(car_id: number) {
    return Cars.query().findById(car_id);
  }

  async findAll(params?: IParams) {
    const cars = Cars.query();

    if (params?.search) {
      cars
        .whereILike('manufacture', `%${params?.search}%`)
        .orWhereILike('model', `%${params?.search}%`);
    }

    cars.orderBy('created_at', 'desc', 'first');

    return await cars;
  }

  async count(params?: IParams) {
    const allCars = Cars.query().count('car_id');
    if (params?.search) {
      allCars
        .whereILike('manufacture', `%${params?.search}%`)
        .orWhereILike('model', `%${params?.search}%`);
    }

    return Number(((await allCars) as unknown as Array<{ count: number }>)[0].count);
  }
}

export default new CarsRepository();

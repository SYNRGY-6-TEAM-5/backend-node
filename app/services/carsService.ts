import CarsRepository, { type IParams } from '../repositories/carsRepository';

import { type IUser } from '../interfaces/IAuth';

class CarsService {
  private _user: IUser | undefined;

  constructor() {}

  async create(requestBody: any) {
    try {
      const payload = {
        ...requestBody,
        created_by: this._user?.user_id,
        updated_by: this._user?.user_id
      };

      delete payload.userToken;

      return await CarsRepository.create(payload);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async update(car_id: number, requestBody: any) {
    try {
      const payload = {
        ...requestBody,
        updated_by: this._user?.user_id
      };

      delete payload.userToken;

      console.log('Payload >>>', payload);

      return await CarsRepository.update(car_id, payload);
    } catch (err) {
      throw err;
    }
  }

  async delete(car_id: number) {
    try {
      return await CarsRepository.delete(car_id);
    } catch (err) {
      throw err;
    }
  }
 
  async list(params?: IParams) {
    try {
      const data = await CarsRepository.findAll(params);
      const count = await CarsRepository.count(params);

      return {
        data,
        count
      };
    } catch (err) {
      throw err;
    }
  }

  async get(car_id: number) {
    try {
      if (!car_id) {
        throw new Error('Invalid car id');
      }
      return await CarsRepository.find(car_id);
    } catch (err) {
      throw err;
    }
  }

  set setUser(userData: IUser) {
    this._user = userData;
  }

  get getUser() {
    return this._user;
  }
}

export default new CarsService();

import ArrivalRepository, { type IParams } from '../repositories/arrivalRepository';

import { type IUser } from '../interfaces/IAuth';

class ArrivalService {
  private _user: IUser | undefined;

  constructor() {}

  async create(requestBody: any) {
    try {
      const payload = {
        ...requestBody
      };

      return await ArrivalRepository.create(payload);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async list(params?: IParams) {
    try {
      const data = await ArrivalRepository.findAll(params);
      const count = await ArrivalRepository.count(params);

      return {
        data,
        count
      };
    } catch (err) {
      throw err;
    }
  }

  async get(arrival_id: number) {
    try {
      if (!arrival_id) {
        throw new Error('Invalid arrival id');
      }
      return await ArrivalRepository.find(arrival_id);
    } catch (err) {
      throw err;
    }
  }

  async update(arrival_id: number, requestBody: any) {
    try {
      const payload = {
        ...requestBody
      };

      return await ArrivalRepository.update(arrival_id, payload);
    } catch (err) {
      throw err;
    }
  }

  async delete(arrival_id: number) {
    try {
      return await ArrivalRepository.delete(arrival_id).returning("arrival_id");
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

export default new ArrivalService();

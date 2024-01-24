import DepartureRepository, { type IParams } from '../repositories/departureRepository';

import { type IUser } from '../interfaces/IAuth';

class DepartureService {
  private _user: IUser | undefined;

  constructor() {}

  async create(requestBody: any) {
    try {
      const payload = {
        ...requestBody
      };

      return await DepartureRepository.create(payload);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async list(params?: IParams) {
    try {
      const data = await DepartureRepository.findAll(params);

      const count = await DepartureRepository.count(params);

      return {
        data,
        count
      };
    } catch (err) {
      throw err;
    }
  }

  async get(departure_id: number) {
    try {
      if (!departure_id) {
        throw new Error('Invalid departure id');
      }
      return await DepartureRepository.find(departure_id);
    } catch (err) {
      throw err;
    }
  }

  async update(departure_id: number, requestBody: any) {
    try {
      const payload = {
        ...requestBody,
      };

      return await DepartureRepository.update(departure_id, payload);
    } catch (err) {
      throw err;
    }
  }

  async delete(departure_id: number) {
    try {
      return await DepartureRepository.delete(departure_id);
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

export default new DepartureService();

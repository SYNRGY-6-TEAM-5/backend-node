import AirlineRepository, { type IParams } from '../repositories/airlineRepository';

import { type IUser } from '../interfaces/IAuth';

class AirlineService {
  private _user: IUser | undefined;

  constructor() {}

  async create(requestBody: any) {
    try {
      const payload = {
        ...requestBody
      };

      delete payload.userToken;

      return await AirlineRepository.create(payload);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async update(airline_id: number, requestBody: any) {
    try {
      const payload = {
        ...requestBody,
        updated_by: this._user?.user_id
      };

      delete payload.userToken;

      console.log('Payload >>>', payload);

      return await AirlineRepository.update(airline_id, payload);
    } catch (err) {
      throw err;
    }
  }

  async delete(airline_id: number) {
    try {
      return await AirlineRepository.delete(airline_id);
    } catch (err) {
      throw err;
    }
  }
 
  async list(params?: IParams) {
    try {
      const data = await AirlineRepository.findAll(params);
      const count = await AirlineRepository.count(params);

      return {
        data,
        count
      };
    } catch (err) {
      throw err;
    }
  }

  async get(airline_id: number) {
    try {
      if (!airline_id) {
        throw new Error('Invalid airport id');
      }
      return await AirlineRepository.find(airline_id);
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

export default new AirlineService();

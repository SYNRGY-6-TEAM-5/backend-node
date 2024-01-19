import AirportRepository, { type IParams } from '../repositories/airportRepository';

import { type IUser } from '../interfaces/IAuth';

class AirportService {
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

      return await AirportRepository.create(payload);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async update(airport_id: number, requestBody: any) {
    try {
      const payload = {
        ...requestBody,
        updated_by: this._user?.user_id
      };

      delete payload.userToken;

      console.log('Payload >>>', payload);

      return await AirportRepository.update(airport_id, payload);
    } catch (err) {
      throw err;
    }
  }

  async delete(airport_id: number) {
    try {
      return await AirportRepository.delete(airport_id);
    } catch (err) {
      throw err;
    }
  }
 
  async list(params?: IParams) {
    try {
      const data = await AirportRepository.findAll(params);
      const count = await AirportRepository.count(params);

      return {
        data,
        count
      };
    } catch (err) {
      throw err;
    }
  }

  async get(airport_id: number) {
    try {
      if (!airport_id) {
        throw new Error('Invalid airport id');
      }
      return await AirportRepository.find(airport_id);
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

export default new AirportService();

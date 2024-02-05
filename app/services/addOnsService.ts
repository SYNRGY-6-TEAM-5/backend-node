import AddOnsRepository from '../repositories/addOnsRepository';
import UserRepository from '../repositories/userRepository';
import { type IUser } from '../models/userModel';
import { IParams } from '../repositories/airportRepository';

class AddOnsService {
  private _user?: IUser;

  constructor() {}

  async create(requestBody: any) {
    try {
      const payload = { ...requestBody };
      return await AddOnsRepository.create(payload);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async list(params?: IParams) {
    try {
      const data = await AddOnsRepository.findAll(params);
      const count = await AddOnsRepository.count(params);

      return {
        data,
        count,
      };
    } catch (err) {
      throw err;
    }
  }

  async get(travel_doc_id: number) {
    try {
      if (!travel_doc_id) {
        throw new Error('Invalid travel document id');
      }
      return await AddOnsRepository.find(travel_doc_id);
    } catch (err) {
      throw err;
    }
  }

  async update(travel_doc_id: number, requestBody: any) {
    try {
      const payload = { ...requestBody };
      delete payload.userToken;

      console.log('Payload >>>', payload);

      return await AddOnsRepository.update(travel_doc_id, payload);
    } catch (err) {
      throw err;
    }
  }

  async delete(travel_doc_id: number) {
    try {
      return await AddOnsRepository.delete(travel_doc_id);
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

export default new AddOnsService();

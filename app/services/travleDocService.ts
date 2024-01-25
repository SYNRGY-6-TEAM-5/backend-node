import TravleDocRepository, { IParams } from '../repositories/travelDocRepository';
import UserRepository from '../repositories/userRepository';
import { type IUser } from '../models/userModel';

class TravelDocService {
  private _user?: IUser;

  constructor() {}

  async create(requestBody: any) {
    try {
      const payload = { ...requestBody };
      return await TravleDocRepository.create(payload);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async list(params?: IParams) {
    try {
      const data = await TravleDocRepository.findAll(params);
      const count = await TravleDocRepository.count(params);

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
      return await TravleDocRepository.find(travel_doc_id);
    } catch (err) {
      throw err;
    }
  }

  async update(travel_doc_id: number, requestBody: any) {
    try {
      const payload = { ...requestBody };
      delete payload.userToken;

      console.log('Payload >>>', payload);

      return await TravleDocRepository.update(travel_doc_id, payload);
    } catch (err) {
      throw err;
    }
  }

  async delete(travel_doc_id: number) {
    try {
      return await TravleDocRepository.delete(travel_doc_id);
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

export default new TravelDocService();

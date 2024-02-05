// import BookingRepository, { type IParams } from '../repositories/bookingRepository';

import { type IUser } from '../interfaces/IAuth';
import MapTicketRepository from '../repositories/mapTicketRepository';

class MapTicketService {
  private _user: IUser | undefined;

  constructor() {}

  async create(requestBody: any) {
    try {
      const payload = {
        ...requestBody
      };

      return await MapTicketRepository.create(payload);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async list() {
    return;
  }

  async delete(contact_id: number) {
    try {
      return await MapTicketRepository.delete(contact_id);
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

export default new MapTicketService();
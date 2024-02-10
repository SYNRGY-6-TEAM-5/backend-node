// import BookingRepository, { type IParams } from '../repositories/bookingRepository';

import { type IUser } from '../interfaces/IAuth';
import PassengerRepository, { PassengerWithBooking } from '../repositories/passengerRepository';
import Passenger from '../models/passengerModel';

class PassengerService {
  private _user: IUser | undefined;

  constructor() {}

  async create(requestBody: any) {
    try {
      const payload = {
        ...requestBody
      };

      return await PassengerRepository.create(payload);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async listSavedPassenger(user_id: string) {
    try {
      let passengers = await PassengerRepository.findAllUserSavedPassenger(user_id);
  
      return {
        data: passengers,
      };
    } catch (err) {
      throw err;
    }
  }
  
  async getOneSavedPassenger(saved_passenger_id: number, user_id: string) {
    try {
      let passenger = await PassengerRepository.findOneUserSavedPassenger(saved_passenger_id, user_id);
  
      return {
        data: passenger,
      };
    } catch (err) {
      throw err;
    }
  }

  // async update(passenger_id: number, requestBody: any) {
  //   try {
  //     const payload = {
  //       ...requestBody
  //     };

  //     // delete payload.departure;
  //     // delete payload.arrival;
  //     // delete payload.airline;

  //     console.log('Payload >>>', payload);

  //     return await PassengerRepository.update(passenger_id, payload);
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // async delete(passenger_id: number) {
  //   try {
  //     return await PassengerRepository.delete(passenger_id);
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  set setUser(userData: IUser) {
    this._user = userData;
  }

  get getUser() {
    return this._user;
  }
}

export default new PassengerService();
// import BookingRepository, { type IParams } from '../repositories/bookingRepository';

import { type IUser } from '../interfaces/IAuth';
import PassengerRepository, { PassengerWithBooking } from '../repositories/passengerRepository';
import Passenger from '../models/passengerModel';

const getRandomUpperCaseChar = () => {
  const charCode = Math.floor(Math.random() * 4) + 65; // Random ASCII code for uppercase A-D (65-68)
  return String.fromCharCode(charCode);
};

const getRandomThreeDigitNumber = () => {
  return Math.floor(Math.random() * 200) + 1; // Random number between 1 to 200
};

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

  async update(passenger_id: number) {
    try {
      const seat = `${getRandomUpperCaseChar()}${getRandomThreeDigitNumber().toString().padStart(3, "0")}`;

      const payload = {
        seat: seat,
      };

      return await PassengerRepository.updateCheckIn(passenger_id, payload);
    } catch (err) {
      throw err;
    }
  }

  async updateSeat(passenger_id: number, seatNum: string) {
    const seat = seatNum;

    const payload = {
      seat: seat,
    };

    return await PassengerRepository.updateCheckIn(passenger_id, payload);
  }

  set setUser(userData: IUser) {
    this._user = userData;
  }

  get getUser() {
    return this._user;
  }
}

export default new PassengerService();
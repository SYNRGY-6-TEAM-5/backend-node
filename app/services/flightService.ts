import FlightRepository, { FlightWithRelations, type IParams } from '../repositories/flightRepository';

import { type IUser } from '../interfaces/IAuth';

class FlightService {
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

      return await FlightRepository.create(payload);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async update(flight_id: number, requestBody: any) {
    try {
      const payload = {
        ...requestBody,
        updated_by: this._user?.user_id
      };

      delete payload.userToken;

      console.log('Payload >>>', payload);

      return await FlightRepository.update(flight_id, payload);
    } catch (err) {
      throw err;
    }
  }

  async delete(flight_id: number) {
    try {
      return await FlightRepository.delete(flight_id);
    } catch (err) {
      throw err;
    }
  }

  async list(params?: IParams) {
    try {
      let data = await FlightRepository.findAll(params);
      let count = await FlightRepository.count(params);

      if (params?.departure_airport) {
        data = data.filter((flight: FlightWithRelations) =>
          flight.departure?.airport_details.iata_code === params.departure_airport
        );
        count = data.length;
      }

      if (params?.arrival_airport) {
        data = data.filter((flight: FlightWithRelations) =>
          flight.arrival?.airport_details.iata_code === params.arrival_airport
        );
        count = data.length;
      }
      if (params?.departure_date) {
        const departureDate = new Date(params.departure_date);
        data = data.filter((flight: FlightWithRelations) =>
          flight?.flight_date.getTime() === departureDate.getTime()
        );
        console.log('Data after departure_date filter:', data);
      }

      console.log('Data after filter: ', typeof data[0].flight_date);
      console.log('Data params: ', typeof params?.departure_date);

      return {
        data,
        count,
      };
    } catch (err) {
      throw err;
    }
  }

  async get(flight_id: number) {
    try {
      if (!flight_id) {
        throw new Error('Invalid aircraft id');
      }
      return await FlightRepository.find(flight_id);
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

export default new FlightService();
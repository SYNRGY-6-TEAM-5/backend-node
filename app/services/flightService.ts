import FlightRepository, { FlightWithRelations, type IParams } from '../repositories/flightRepository';

import { type IUser } from '../interfaces/IAuth';

class FlightService {
  private _user: IUser | undefined;

  constructor() {}

  async create(requestBody: any) {
    try {
      const payload = {
        ...requestBody
      };

      return await FlightRepository.create(payload);
    } catch (err) {
      console.log(err);
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
          flight?.departure?.scheduled_time?.toISOString().split('T')[0] === departureDate.toISOString().split('T')[0]
        );
      }

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
        throw new Error('Invalid flight id');
      }
      
      return await FlightRepository.find(flight_id);
    } catch (err) {
      throw err;
    }
  }

  async update(flight_id: number, requestBody: any) {
    try {
      const payload = {
        ...requestBody
      };

      delete payload.departure;
      delete payload.arrival;
      delete payload.airline;

      console.log('Payload >>>', payload);

      return await FlightRepository.update(flight_id, payload);
    } catch (err) {
      throw err;
    }
  }

  async delete(flight_id: number) {
    try {
      return await FlightRepository.delete(flight_id).returning("flight_id");
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
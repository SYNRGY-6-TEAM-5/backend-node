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

  async list() {
    return;
  }

  // async list(params?: IParams) {
  //   try {
  //     let passengers = await PassengerRepository.findAll(params);
  //     let count = await PassengerRepository.count(params);

  //     if (params?.booking_id) {
  //       passengers = passengers.filter((passenger: PassengerWithBooking) =>
  //         passenger.booking?.booking_id === params.booking_id
  //       );
  //       count = passengers.length;
  //     }

      // if (params?.arrival_airport) {
      //   tickets = tickets.filter((ticket: TicketWithFlight) =>
      //     ticket.flight?.arrival?.airport_details.iata_code === params.arrival_airport
      //   );
      //   count = tickets.length;
      // }
      // if (params?.departure_date) {
      //   const departureDate = new Date(params.departure_date);
      //   tickets = tickets.filter((ticket: TicketWithFlight) =>
      //   ticket.flight?.departure?.scheduled_time?.toISOString().split('T')[0] === departureDate.toISOString().split('T')[0]
      //   );
      //   count = tickets.length;
      // }
  
  //     return {
  //       data: passengers,
  //       count,
  //     };
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  async get(passenger_id: number) {
    try {
      if (!passenger_id) {
        throw new Error('Invalid passenger id');
      }
      
      let passengers = await PassengerRepository.find(passenger_id);
      return await Promise.all(
        passengers.map(async (passenger: Passenger) => {
          // const bookingDetails = await BookingRepository.find(passenger.booking_id);
          // const benefits = await BenefitRepository.findByFlightId(ticket.flight_id);
  
          return {
            ...passenger,
            // booking: bookingDetails[0],
            // benefits,
          };
        })
      );
    } catch (err) {
      throw err;
    }
  }

  async update(passenger_id: number, requestBody: any) {
    try {
      const payload = {
        ...requestBody
      };

      // delete payload.departure;
      // delete payload.arrival;
      // delete payload.airline;

      console.log('Payload >>>', payload);

      return await PassengerRepository.update(passenger_id, payload);
    } catch (err) {
      throw err;
    }
  }

  async delete(passenger_id: number) {
    try {
      return await PassengerRepository.delete(passenger_id);
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

export default new PassengerService();
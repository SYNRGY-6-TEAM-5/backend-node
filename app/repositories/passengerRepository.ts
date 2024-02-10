import Passenger, { IPassenger } from '../models/passengerModel';
import SavedPassenger, { ISavedPassenger } from '../models/savedPassengerModel';
import { IParams } from './flightRepository';
// import { BookingWithRelations } from './bookingRepository';

export interface PassengerWithBooking extends IPassenger {
  // booking: BookingWithRelations;
}

class PassengerRepository {
  create(createArgs: any) {
    console.log(createArgs);
    return Passenger.query().insert(createArgs);
  }

  createSavedPassenger(createArgs: any) {
    console.log(createArgs);
    return SavedPassenger.query().insert(createArgs);
  }

  async findAllPassengerWithBookingId(booking_id: number, params?: IParams): Promise<Array<IPassenger>> {
    let passsengersQuery = Passenger.query().where('booking_id', booking_id);

    if (params?.search) {
      passsengersQuery = passsengersQuery.where('name', 'like', `%${params?.search}%`);
    }

    const passengers = await passsengersQuery.orderBy('created_at', 'desc');

    return passengers as unknown as Array<IPassenger>;
  }

  async findAllUserSavedPassenger(user_id: string): Promise<Array<IPassenger>> {
    let passsengersQuery = SavedPassenger.query().where('user_id', user_id);

    const passengers = await passsengersQuery.orderBy('created_at', 'desc');

    return passengers as unknown as Array<IPassenger>;
  }

  async findOneUserSavedPassenger(saved_passenger_id: number, user_id: string): Promise<Array<ISavedPassenger>> {
    try {
      const passengers = await SavedPassenger.query()
        .where('saved_passenger_id', saved_passenger_id)
        .andWhere('user_id', user_id)
        .withGraphFetched('travel_docs'); // Eagerly fetch related travel docs

      return passengers as unknown as Array<ISavedPassenger>;
    } catch (error) {
      throw error;
    }
  }

  // async find(passenger_id: number, params?: IParams): Promise<Array<PassengerWithBooking>> {
  //   let passengerQuery = Passenger.query()
  //     .findById(passenger_id);
  //     // .joinRelated('flight(selectDepartureDetails).departure');

  //   const passenger = await passengerQuery;

  //   if (!passenger) {
  //     throw new Error(`passenger with ID ${passenger_id} not found`);
  //   }

  //   return [passenger] as Array<PassengerWithBooking>;
  // }

  // update(passenger_id: number, updateArgs: any) {
  //   return Passenger.query().patchAndFetchById(passenger_id, updateArgs);
  // }

  // delete(passenger_id: number) {
  //   return Passenger.query().deleteById(passenger_id);
  // }

  // async count(params?: IParams) {
  //   let countQuery = Passenger.query().joinRelated('booking');

  //   if (params?.search) {
  //     const searchValue = `%${params.search}%`;
  //     countQuery = countQuery
  //       .where('passenger.name', 'ilike', searchValue)
  //       .orWhere('passenger.NIK', 'ilike', searchValue);
  //   }

  //   const count = await countQuery.resultSize();
  //   return count;
  // }

}

export default new PassengerRepository();
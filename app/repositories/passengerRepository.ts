import Passenger, {IPassenger} from '../models/passengerModel';
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

  async findAllPassengerWithBookingId(booking_id: number, params?: IParams): Promise<Array<IPassenger>> {
    let passsengersQuery = Passenger.query().where('booking_id', booking_id);

    if (params?.search) {
      passsengersQuery = passsengersQuery.where('name', 'like', `%${params?.search}%`);
    }

    const passengers = await passsengersQuery.orderBy('created_at', 'desc');

    return passengers as unknown as Array<IPassenger>;
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
import Passenger from '../models/passengerModel';
// import { BookingWithRelations } from './bookingRepository';

export interface PassengerWithBooking extends Passenger {
  // booking: BookingWithRelations;
}

export interface IParams {
  passenger_id?: number;
  booking_id?: number;
  NIK?: string;
  name?: string;
  date_of_birth?: Date;
  vaccinated?: boolean;
  created_at?: number;
  updated_at?: number;
}

class PassengerRepository {
  create(createArgs: any) {
    console.log(createArgs);
    return Passenger.query().insert(createArgs);
  }

  // async findAll(params?: IParams): Promise<Array<PassengerWithBooking>> {
  //   let passengersQuery = Passenger.query()
  //     .select("passenger.*")
  //     .joinRelated('booking')
  //     .withGraphFetched(`[
  //       booking.[
  //         departure(selectAirportDetails).[airport_details],
  //         arrival(selectAirportDetails).[airport_details],
  //         airline
  //       ]
  //     ]`);

  //   if (params?.search) {
  //     const searchValue = `%${params.search}%`;
  //     passengersQuery = passengersQuery
  //       .whereILike('passenger.passenger_id', searchValue)
  //       .orWhereILike('passenger.NIK', searchValue);
  //   }

  //   const passengers = await passengersQuery.orderBy('passenger.created_at', 'desc');

  //   return passengers as Array<PassengerWithBooking>;
  // }

  async find(passenger_id: number, params?: IParams): Promise<Array<PassengerWithBooking>> {
    let passengerQuery = Passenger.query()
      .findById(passenger_id);
      // .joinRelated('flight(selectDepartureDetails).departure');

    const passenger = await passengerQuery;

    if (!passenger) {
      throw new Error(`passenger with ID ${passenger_id} not found`);
    }

    return [passenger] as Array<PassengerWithBooking>;
  }

  update(passenger_id: number, updateArgs: any) {
    return Passenger.query().patchAndFetchById(passenger_id, updateArgs);
  }

  delete(passenger_id: number) {
    return Passenger.query().deleteById(passenger_id);
  }

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
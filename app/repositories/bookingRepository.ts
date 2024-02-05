import Booking, { IBooking } from '../models/bookingModel';

export interface IParams {
  page?: number;
  size?: number;
  search?: string;
  departure_airport?: string;
  arrival_airport?: string;
  departure_date?: string;
}

class BookingRepository {
  async findAllUserId(user_id: string, params?: IParams): Promise<Array<IBooking>> {
    let bookingsQuery = Booking.query().where('user_id', user_id);

    if (params?.search) {
      bookingsQuery = bookingsQuery.where('some_column', 'like', `%${params?.search}%`);
      // Replace 'some_column' with the column name you want to search on
    }

    const bookings = await bookingsQuery.orderBy('created_at', 'desc');

    return bookings as unknown as Array<IBooking>;
  }

  async find(booking_id: number, params?: IParams): Promise<Array<IBooking>> {
    let bookingQuery = Booking.query()
      .findById(booking_id)
      .select('booking.*');

    const booking = await bookingQuery;

    if (!booking) {
      throw new Error(`Flight with ID ${booking_id} not found`);
    }

    return [booking] as unknown as Array<IBooking>;
  }

  update(flight_id: number, updateArgs: any) {
    return Booking.query().patchAndFetchById(flight_id, updateArgs);
  }

  delete(flight_id: number) {
    return Booking.query().deleteById(flight_id);
  }

  async count(user_id: string, params?: IParams) {
    let allFlights = Booking.query().where('user_id', user_id).count('booking_id');

    if (params?.search) {
      allFlights = allFlights
        .whereILike('flight_number', `%${params?.search}%`)
        .orWhereILike('iata', `%${params?.search}%`);
    }
    return Number(((await allFlights) as unknown as Array<{ count: number }>)[0].count);
  }
}

export default new BookingRepository();
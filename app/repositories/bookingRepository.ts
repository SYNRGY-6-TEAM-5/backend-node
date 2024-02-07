import { IPassengerAddon } from '../models/addOnsModel';
import Booking, { IBooking } from '../models/bookingModel';
import MapTicket, { IMapTicket } from '../models/mapTicketModel';
import { IPassenger } from '../models/passengerModel';
import { ITravelDoc } from '../models/travelDocModel';
import { TicketWithFlight } from './ticketRepository';

export interface IParams {
  page?: number;
  size?: number;
  search?: string;
  departure_airport?: string;
  arrival_airport?: string;
  departure_date?: string;
}

interface PassengerWithRelation extends IPassenger {
  travel_docs: ITravelDoc[];
  add_ons: IPassengerAddon[];
}

export interface BookingWithDetails extends IBooking {
  tickets?: any[];
  map_ticket: IMapTicket[];
  passengers: PassengerWithRelation[];
}

class BookingRepository {
  async findAllUserId(user_id: string, params?: IParams): Promise<Array<BookingWithDetails>> {
    let bookingsQuery = await Booking.query()
      .select(
        'booking.*',
        'contact_details.fullName',
        'contact_details.email',
        'contact_details.phone',
      )
      .leftJoin('contact_details', 'booking.booking_id', 'contact_details.booking_id')
      .where('booking.user_id', user_id)
      .withGraphFetched(`[
          map_ticket,
          passengers(selectPassengerDetails).[travel_docs, add_ons],
        ]`);

    return bookingsQuery as unknown as Array<BookingWithDetails>;
  }

  async findOneByUserIdAndBookingId(user_id: string, booking_id: number): Promise<BookingWithDetails> {
    const booking = await Booking.query()
      .select(
        'booking.*',
        'contact_details.fullName',
        'contact_details.email',
        'contact_details.phone',
      )
      .leftJoin('contact_details', 'booking.booking_id', 'contact_details.booking_id')
      .where('booking.user_id', user_id)
      .andWhere('booking.booking_id', booking_id)
      .withGraphFetched(`[
          map_ticket,
          passengers(selectPassengerDetails).[travel_docs, add_ons],
        ]`)
      .first();

    return booking as unknown as BookingWithDetails;
  }

  async findOne(user_id: string, booking_id: number, params?: IParams): Promise<IBooking> {
    let bookingQuery = Booking.query()
      .where('booking.user_id', user_id)
      .andWhere('booking.booking_id', booking_id)
      .select('booking.*')
      .first();

    const booking = await bookingQuery;

    if (!booking) {
      throw new Error(`Booking with ID ${booking_id} not found`);
    }

    return booking as unknown as IBooking;
  }

  update(booking_id: number, updateArgs: any) {
    return Booking.query().patchAndFetchById(booking_id, updateArgs);
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
import Ticket from '../models/ticketModel';
import { FlightWithRelations } from './flightRepository';

export interface TicketWithFlight extends Ticket {
  flight: FlightWithRelations;
}

export interface IParams {
  page?: number;
  size?: number;
  search?: string;
  departure_airport?: string;
  arrival_airport?: string;
  departure_date?: string;
}

class TicketRepository {
  create(createArgs: any) {
    return Ticket.query().insert(createArgs);
  }

  async findAll(params?: IParams): Promise<Array<TicketWithFlight>> {
    let ticketsQuery = Ticket.query()
      .select("ticket.*")
      .joinRelated('flight')
      .withGraphFetched(`[
        flight.[
          departure(selectAirportDetails).[airport_details],
          arrival(selectAirportDetails).[airport_details],
          airline
        ]
      ]`);

    if (params?.search) {
      const searchValue = `%${params.search}%`;
      ticketsQuery = ticketsQuery
        .whereILike('flight.flight_number', searchValue)
        .orWhereILike('flight.iata', searchValue);
    }

    const tickets = await ticketsQuery.orderBy('ticket.created_at', 'desc');

    return tickets as Array<TicketWithFlight>;
  }

  async find(ticket_id: number, params?: IParams): Promise<Array<TicketWithFlight>> {
    let ticketQuery = Ticket.query()
      .findById(ticket_id)
      .joinRelated('flight(selectDepartureDetails).departure');

    const ticket = await ticketQuery;

    if (!ticket) {
      throw new Error(`ticket with ID ${ticket_id} not found`);
    }

    return [ticket] as Array<TicketWithFlight>;
  }

  update(flight_id: number, updateArgs: any) {
    return Ticket.query().patchAndFetchById(flight_id, updateArgs);
  }

  delete(flight_id: number) {
    return Ticket.query().deleteById(flight_id);
  }

  async count(params?: IParams) {
    let countQuery = Ticket.query().joinRelated('flight');

    if (params?.search) {
      const searchValue = `%${params.search}%`;
      countQuery = countQuery
        .where('flight.flight_number', 'ilike', searchValue)
        .orWhere('flight.iata', 'ilike', searchValue);
    }

    const count = await countQuery.resultSize();
    return count;
  }

}

export default new TicketRepository();
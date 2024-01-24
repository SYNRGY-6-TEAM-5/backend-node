import FlightRepository, { type IParams } from '../repositories/flightRepository';
import BenefitRepository from '../repositories/benefitRepository';

import { type IUser } from '../interfaces/IAuth';
import TicketRepository, { TicketWithFlight } from '../repositories/ticketRepository';
import Ticket from '../models/ticketModel';

class TicketService {
  private _user: IUser | undefined;

  constructor() {}

  async create(requestBody: any) {
    try {
      const payload = {
        ...requestBody
      };

      return await TicketRepository.create(payload);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async list(params?: IParams) {
    try {
      let tickets = await TicketRepository.findAll(params);
      let count = await TicketRepository.count(params);

      if (params?.departure_airport) {
        tickets = tickets.filter((ticket: TicketWithFlight) =>
          ticket.flight?.departure?.airport_details.iata_code === params.departure_airport
        );
        count = tickets.length;
      }

      if (params?.arrival_airport) {
        tickets = tickets.filter((ticket: TicketWithFlight) =>
          ticket.flight?.arrival?.airport_details.iata_code === params.arrival_airport
        );
        count = tickets.length;
      }
      if (params?.departure_date) {
        const departureDate = new Date(params.departure_date);
        tickets = tickets.filter((ticket: TicketWithFlight) =>
        ticket.flight?.departure?.scheduled_time?.toISOString().split('T')[0] === departureDate.toISOString().split('T')[0]
        );
        count = tickets.length;
      }
  
      return {
        data: tickets,
        count,
      };
    } catch (err) {
      throw err;
    }
  }

  async get(ticket_id: number) {
    try {
      if (!ticket_id) {
        throw new Error('Invalid ticket id');
      }
      
      let tickets = await TicketRepository.find(ticket_id);
      return await Promise.all(
        tickets.map(async (ticket: Ticket) => {
          const flightDetails = await FlightRepository.find(ticket.flight_id);
          const benefits = await BenefitRepository.findByFlightId(ticket.flight_id);
  
          return {
            ...ticket,
            flight: flightDetails[0],
            benefits,
          };
        })
      );
    } catch (err) {
      throw err;
    }
  }

  async update(ticket_id: number, requestBody: any) {
    try {
      const payload = {
        ...requestBody
      };

      delete payload.departure;
      delete payload.arrival;
      delete payload.airline;

      console.log('Payload >>>', payload);

      return await TicketRepository.update(ticket_id, payload);
    } catch (err) {
      throw err;
    }
  }

  async delete(ticket_id: number) {
    try {
      return await TicketRepository.delete(ticket_id);
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

export default new TicketService();
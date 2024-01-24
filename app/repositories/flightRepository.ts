import { Model } from 'objection';
import Flight from '../models/flightModel';
import Departure from '../models/departureModel';
import Airline from '../models/airlineModel';
import Arrival from '../models/arrivalModel';
import Airport from '../models/airportModel';

export interface DepartureWithAirport extends Departure {
  scheduled_time: Date;
  airport_details: Airport;
}

interface ArrivalWithAirport extends Arrival {
  scheduled_time: Date;
  airport_details: Airport;
}

export interface FlightWithRelations extends Flight {
  flight_date: Date;
  departure: DepartureWithAirport;
  arrival: ArrivalWithAirport;
  airline: Airline;
}

export interface IParams {
  page?: number;
  size?: number;
  search?: string;
  departure_airport?: string;
  arrival_airport?: string;
  departure_date?: string;
}

class FlightRepository {
  create(createArgs: any) {
    return Flight.query().insert(createArgs);
  }

  async findAll(params?: IParams): Promise<Array<FlightWithRelations>> {
    let flightsQuery = Flight.query()
      .select('flight.*')
      .withGraphFetched(`[
        departure(selectAirportDetails).[airport_details],
        arrival(selectAirportDetails).[airport_details],
        airline,
      ]`);

    if (params?.search) {
      flightsQuery = flightsQuery
        .whereILike('flight_number', `%${params?.search}%`)
        .orWhereILike('iata', `%${params?.search}%`);
    }

    const airports = await flightsQuery.orderBy('created_at', 'desc');

    return airports as Array<FlightWithRelations>;
  }

  async find(flight_id: number, params?: IParams): Promise<Array<FlightWithRelations>> {
    let flightQuery = Flight.query()
      .findById(flight_id)
      .select('flight.*')
      .withGraphFetched(`[
        departure(selectAirportDetails).[airport_details],
        arrival(selectAirportDetails).[airport_details],
        airline,
      ]`);

    const flight = await flightQuery;

    if (!flight) {
      throw new Error(`Flight with ID ${flight_id} not found`);
    }

    return [flight] as Array<FlightWithRelations>;
  }

  update(flight_id: number, updateArgs: any) {
    return Flight.query().patchAndFetchById(flight_id, updateArgs);
  }

  delete(flight_id: number) {
    return Flight.query().deleteById(flight_id);
  }

  async count(params?: IParams) {
    let allFlights = Flight.query().count('flight_id');

    if (params?.search) {
      allFlights = allFlights
        .whereILike('flight_number', `%${params?.search}%`)
        .orWhereILike('iata', `%${params?.search}%`);
    }
    return Number(((await allFlights) as unknown as Array<{ count: number }>)[0].count);
  }
}

export default new FlightRepository();
import { Model } from 'objection';
import Flight, {IFlight} from '../models/flightModel';
import Departure from '../models/departureModel';
import Airline from '../models/airlineModel';
import Arrival from '../models/arrivalModel';
import Airport from '../models/airportModel';

interface DepartureWithAirport extends Departure {
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

  update(aircraft_id: number, updateArgs: any) {
    return Flight.query().patchAndFetchById(aircraft_id, updateArgs);
  }

  delete(aircraft_id: number) {
    return Flight.query().deleteById(aircraft_id);
  }

  find(aircraft_id: number) {
    return Flight.query().findById(aircraft_id);
  }

  async findAll(params?: IParams): Promise<Array<FlightWithRelations>> {
    let flightsQuery = Flight.query()
      .select('flight.*')
      .withGraphFetched(`[
        departure(selectAirportDetails).[airport_details],
        arrival(selectAirportDetails).[airport_details],
        airline,
      ]`);

    const airports = await flightsQuery.orderBy('created_at', 'desc');

    return airports as Array<FlightWithRelations>;
  }

  async count(params?: IParams) {
    let allAircraft = Flight.query().count('flight_id');

    if (params?.search) {
      allAircraft = allAircraft
        .whereILike('airport_name', `%${params?.search}%`)
        .orWhereILike('iata_code', `%${params?.search}%`)
        .orWhereILike('country_name', `%${params?.search}%`);
    }

    return Number(((await allAircraft) as unknown as Array<{ count: number }>)[0].count);
  }
}

export default new FlightRepository();
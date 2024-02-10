import axios, { AxiosResponse } from 'axios';
import ContactDetailsService from './contactService';

import { type IUser } from '../interfaces/IAuth';
import { ICompleteBooking } from '../types/Booking';
import PassengerService from './passengerService';
import TravleDocService from './travleDocService';
import MapTicketService from './mapTicketService';
import AddOnsService from './addOnsService';
import { ITravelDoc } from '../models/travelDocModel';
import Passenger, { IPassenger } from '../models/passengerModel';
import PassengerAddon, { IPassengerAddon } from '../models/addOnsModel';
import BookingRepository, { BookingWithDetails } from '../repositories/bookingRepository';
import { IParams } from '../repositories/airportRepository';
import Booking, { IBooking } from '../models/bookingModel';
import ContactDetails from '../models/contactModel';
import passengerRepository from '../repositories/passengerRepository';
import TicketRepository, { TicketWithFlight } from '../repositories/ticketRepository';
import TicketService from './ticketService';

interface IResultData {
  passenger: IPassenger;
  travelDocs: ITravelDoc[];
  departureAddOns: IPassengerAddon[];
  returnAddOns: IPassengerAddon[];
}

async function sendPassengerData(passenger: any, booking_id: number) {
  try {
    const {
      nik,
      id,
      fullName,
      dateOfBirth,
      courtesy_title,
      vaccinated
    } = passenger;

    const resultData: IResultData = {
      passenger: {
        passenger_id: 0,
        booking_id: 0,
        id: "",
        nik: "",
        name: "",
        date_of_birth: new Date(),
        courtesy_title: "",
        vaccinated: false,
        created_at: 0,
        updated_at: 0
      },
      travelDocs: [],
      departureAddOns: [],
      returnAddOns: []
    };


    const payload = {
      booking_id: booking_id,
      nik: nik,
      id: id,
      name: fullName,
      date_of_birth: dateOfBirth,
      courtesy_title: courtesy_title,
      vaccinated: vaccinated === "yes" ? true : false,
    };

    const passenger_result = await PassengerService.create(payload);
    resultData.passenger = passenger_result as unknown as IPassenger;

    for (const doc of passenger.travel_docs) {
      const {
        doc_type,
        nationality,
        document_number,
        expire_date,
        image_url
      } = doc;

      const travelPayload = {
        passenger_id: passenger_result.passenger_id,
        doc_type: doc_type,
        nationality: nationality,
        doc_number: document_number,
        expired_date: expire_date,
        file: image_url,
        valid: false,
      };

      const travelDocsResult = await TravleDocService.create(travelPayload);

      resultData.travelDocs.push(travelDocsResult as unknown as ITravelDoc);
    }

    for (const mealsAddOn of passenger.add_ons.departure.meals) {


      const departurePayload = {
        passenger_id: passenger_result.passenger_id,
        trip_type: 'departure',
        meal_name: mealsAddOn.meal_name,
        meal_price: parseFloat(mealsAddOn.meal_price),
        meal_img: mealsAddOn.meal_img,
        meal_count: mealsAddOn.count,
        baggage_weight: passenger.add_ons.departure.baggage.baggage_weight,
        baggage_price: parseFloat(passenger.add_ons.departure.baggage.baggage_price)
      };

      const departureResult = await AddOnsService.create(departurePayload);
      resultData.departureAddOns.push(departureResult as unknown as IPassengerAddon);
    }

    for (const mealsAddOn of passenger.add_ons.return.meals) {


      const returnPayload = {
        passenger_id: passenger_result.passenger_id,
        trip_type: 'return',
        meal_name: mealsAddOn.meal_name,
        meal_price: parseFloat(mealsAddOn.meal_price),
        meal_img: mealsAddOn.meal_img,
        meal_count: mealsAddOn.count,
        baggage_weight: passenger.add_ons.return.baggage.baggage_weight,
        baggage_price: parseFloat(passenger.add_ons.return.baggage.baggage_price)
      };

      const returnResult = await AddOnsService.create(returnPayload);
      resultData.returnAddOns.push(returnResult as unknown as IPassengerAddon);
    };

    return resultData;

  } catch (error) {
    console.error(`Error occurred while sending data for passenger ${passenger.fullName}:`, error);
  }
}

class BookingService {
  private _user: IUser | undefined;

  constructor() { }

  async create(requestBody: ICompleteBooking, token: string) {
    try {
      const {
        ticket_details,
        contact_details,
        passenger_details,
        passenger_addOns,
        trip_insurance } = requestBody;

      const insuranceAvailability: { [key: string]: boolean } = {};
      for (const [key, value] of Object.entries(trip_insurance)) {
        insuranceAvailability[key] = value.type !== "" && value.price !== 0;
      }

      const bookingReqBody = {
        booking_code: null,
        total_passenger: passenger_details.length,
        expired_time: ticket_details.expired_time,
        total_amount: ticket_details.total_ticket_price,
        full_protection: insuranceAvailability.full_insurance,
        bag_insurance: insuranceAvailability.baggage_insurance,
        flight_delay: insuranceAvailability.flight_delay_insurance,
        payment_method: "",
        status: "pending"
      }

      const response: AxiosResponse = await axios.post('https://backend-java-production-ece2.up.railway.app/api/v1/booking', bookingReqBody,
        {
          headers: {
            'Authorization': `${token}`
          }
        }
      );

      const resBookingData = response.data;
      const resBookingId = parseInt(response.data.bookingId, 10);

      console.log(resBookingData);

      let mapTicketResult = {};

      for (const ticket_id of ticket_details.booked_ticket) {
        const mapTicketPayload = {
          booking_id: resBookingId,
          ticket_id: ticket_id,
        };

        mapTicketResult = await MapTicketService.create(mapTicketPayload);
      }

      const contactDetailsReqBody = {
        booking_id: resBookingId,
        fullName: contact_details.fullName,
        email: contact_details.email,
        phone: contact_details.phone
      }

      const contact_result = await ContactDetailsService.create(contactDetailsReqBody);

      const updatedPassengerDetails = passenger_details.map(passenger => {
        const addOnsForPassenger = passenger_addOns.find(addOn => addOn.passenger_name === passenger.fullName);
        if (addOnsForPassenger) {
          return {
            ...passenger,
            add_ons: addOnsForPassenger
          };
        } else {
          return passenger;
        }
      });

      const passenger_details_result: IResultData[] = [];

      const sendPassengerPromises = updatedPassengerDetails.map(passenger =>
        sendPassengerData(passenger, resBookingId)
      );

      const passengerResults = await Promise.all(sendPassengerPromises);

      passengerResults.forEach(passenger_result => {
        passenger_details_result.push(
          passenger_result
            ? passenger_result
            : {
              passenger: {
                passenger_id: 0,
                booking_id: 0,
                nik: "",
                id: "",
                name: "",
                date_of_birth: new Date(),
                courtesy_title: "",
                vaccinated: false,
                created_at: 0,
                updated_at: 0
              },
              travelDocs: [],
              departureAddOns: [],
              returnAddOns: []
            }
        );
      });

      const result = {
        user_data: contact_result,
        booking_data: resBookingData,
        map_ticket: mapTicketResult,
        passengers_data: passenger_details_result,
      };

      return result;

    } catch (err) {
      throw err;
    }
  }

  async listAllBookingWithUserId(user_id: string, params?: IParams) {
    let data: BookingWithDetails[] = await BookingRepository.findAllUserId(user_id);

    const updatedData: BookingWithDetails[] = [];

    // Iterate over each booking
    for (const booking of data) {
      const tickets = await Promise.all(
        booking.map_ticket.map(async (mapTicket) => {
          try {
            const ticket = await TicketService.get(mapTicket.ticket_id);
            return ticket[0]; // Assuming find always returns an array
          } catch (error) {
            return null; // Handle error or missing ticket
          }
        })
      );

      // Filter out null values and ensure type safety
      const filteredTickets = tickets.filter((ticket) => ticket !== null);

      // Append fetched tickets to the booking
      const bookingWithTickets: BookingWithDetails = {
        ...booking,
        tickets: filteredTickets,
      };

      // Push the updated booking to the new array
      updatedData.push(bookingWithTickets);
    }

    let count = await BookingRepository.count(user_id, params);

    return {
      updatedData,
      count
    };
  }

  async GetBookingWithUserIdAndBookingId(user_id: string, booking_id: number, params?: IParams) {
    let data: BookingWithDetails = await BookingRepository.findOneByUserIdAndBookingId(user_id, booking_id);

    const updatedData: BookingWithDetails[] = [];

    const tickets = await Promise.all(
      data.map_ticket.map(async (mapTicket) => {
        try {
          const ticket = await TicketService.get(mapTicket.ticket_id);
          return ticket[0]; // Assuming find always returns an array
        } catch (error) {
          return null; // Handle error or missing ticket
        }
      })
    );

    // Filter out null values and ensure type safety
    const filteredTickets = tickets.filter((ticket) => ticket !== null);

    // Append fetched tickets to the booking
    const bookingWithTickets: BookingWithDetails = {
      ...data,
      tickets: filteredTickets,
    };

    // Push the updated booking to the new array
    updatedData.push(bookingWithTickets);

    return {
      updatedData,
      count: 1
    };
  }

  async update(booking_id: number, requestBody: any) {
    try {
      const { payment_method_types, status } = requestBody;


      const payload = {
        payment_method_types,
        status
      };

      console.log('Payload >>>', payload);

      // return await BookingRepository.update(booking_id, payload);
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

export default new BookingService();
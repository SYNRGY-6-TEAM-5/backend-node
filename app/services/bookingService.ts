import FlightRepository, { type IParams } from '../repositories/flightRepository';
import BenefitRepository from '../repositories/benefitRepository';

import axios, { AxiosResponse } from 'axios';
import ContactDetailsService from './contactService';

import { type IUser } from '../interfaces/IAuth';
import TicketRepository, { TicketWithFlight } from '../repositories/ticketRepository';
import Ticket from '../models/ticketModel';
import { ICompleteBooking } from '../types/Booking';
import PassengerService from './passengerService';
import TravleDocService from './travleDocService';

interface TripInsurance {
  [key: string]: {
    type: string;
    price: number;
  };
}

async function sendPassengerData(passenger: any) {
  try {
    const {
      nik,
      fullName,
      dateOfBirth,
      courtesy_title,
      vaccinated
    } = passenger;

    // Construct the payload
    const payload = {
      booking_id: 1,
      NIK: nik,
      name: fullName,
      date_of_birth: dateOfBirth,
      courtesy_title: courtesy_title,
      vaccinated: vaccinated === "yes" ? true : false,
    };

    // Send data to the service
    const passenger_result = await PassengerService.create(payload);

    for (const doc of passenger.travel_docs) {
      const {
        doc_type,
        nationality,
        document_number,
        expire_date,
        image_url
      } = doc;

      // Construct the payload for travel doc creation
      const travelPayload = {
        passenger_id: passenger_result.passenger_id,
        doc_type: doc_type,
        nationality: nationality,
        doc_number: document_number,
        expired_date: expire_date,
        file: image_url,
        valid: false,
      };

      // Send data to create travel doc
      const travelDocsResult = await TravleDocService.create(travelPayload);

      console.log(`Travel document created successfully for passenger ${fullName} with ID ${passenger_result.passenger_id}. Response:`, travelDocsResult);
    }
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
        user_data,
        contact_details,
        passenger_details,
        passenger_addOns,
        trip_insurance } = requestBody;

      const insuranceAvailability: { [key: string]: boolean } = {};
      for (const [key, value] of Object.entries(trip_insurance)) {
        insuranceAvailability[key] = value.type !== "" && value.price !== 0;
      }

      const bookingReqBody = {
        trip_type: ticket_details.booked_ticket.length === 1 ? "one-way" : "roundtrip",
        total_passenger: passenger_details.length,
        expired_time: ticket_details.expired_time,
        total_amount: ticket_details.total_ticket_price,
        full_protection: insuranceAvailability.full_insurance,
        bag_insurance: insuranceAvailability.baggage_insurance,
        flight_delay: insuranceAvailability.flight_delay_insurance,
        payment_method: null,
        status: null
      }

      const response: AxiosResponse = await axios.post('https://backend-java-production-ece2.up.railway.app/api/v1/booking', bookingReqBody,
        {
          headers: {
            'Authorization': `${token}`
          }
        }
      );
      const responseData = response.data;

      console.log("Response Data: ", responseData);

      // Map Ticket Nunggu response booking_id dari BEJ


      const contactDetailsReqBody = {
        booking_id: 1, // nanti dirubah data response data endpoint booking bej
        fullName: contact_details.fullName,
        email: contact_details.email,
        phone: contact_details.phone
      }

      const contact_result = await ContactDetailsService.create(contactDetailsReqBody);

      console.log("Service contact_result >>> ", contact_result);

      console.log("Service user_data >>> ", user_data);
      
      passenger_details.forEach(async passenger => {
        await sendPassengerData(passenger);
      });

      console.log("Service passenger_details >>> ", passenger_details.length);
      console.log("Service passenger_addOns >>> ", passenger_addOns);
      console.log("Service trip_insurance >>> ", insuranceAvailability);

    } catch (err) {
      console.log(err);
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
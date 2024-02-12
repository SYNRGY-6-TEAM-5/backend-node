import { type Request, type Response, type NextFunction } from 'express';
import BookingService from '../../../services/bookingService';
import ResponseBuilder from '../../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../../middlewares/auth';

import { type IRestController } from '../../../interfaces/IRest';
import { ITicket } from '../../../models/ticketModel';
import { ForeignKeyViolationError } from 'objection';
import FlightService from '../../../services/flightService';
import { ICompleteBooking } from '../../../types/Booking';
import AuthService from '../../../services/authService';
import { IBooking } from '../../../models/bookingModel';
import mapTicketService from '../../../services/mapTicketService';
import passengerService from '../../../services/passengerService';

const defaultMeta = {
  page: 1,
  size: 10,
  totalData: 0,
  totalPages: 0
};

class UserBookingController {
  constructor() { }

  async create(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const headers = req.headers;

      if (!headers.authorization) {
        return res.status(403).json({
          data: 'not authorized'
        });
      }

      const result = await BookingService.create(req.body as ICompleteBooking, headers.authorization);

      const responseData = ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success processing user booking'
      });

      return responseData;

    } catch (error: any) {
      if (error instanceof ForeignKeyViolationError) {
        return res.status(422).json({
          status: 'FAIL',
          message: "Failed processing user booking",
          server_log: error.message
        });
      } else {
        return res.status(500).json({
          status: 'FAIL',
          message: "Failed processing user booking",
          server_log: error.message
        });
      }
    }
  }

  async listAllBookingWithUserUserId(req: Request, res: Response) {
    try {
      const headers = req.headers;

      const bearerToken = `${headers.authorization}`.split('Bearer');
      const token = bearerToken[1]?.trim();
      const userJWTData = await AuthService.validateToken(token);
      const { updatedData, count } = await BookingService.listAllBookingWithUserId(userJWTData.userId);

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: updatedData,
        message: `success showing list of all user ${userJWTData.userId} bookings`,
        meta: { ...defaultMeta, totalData: count }
      });

      return responseData;

    } catch (error: any) {
      res.status(500).json({
        status: 'FAIL',
        message: error.message
      });
    }
  }

  async showBookingWithUserUserIdAndBookingId(req: Request, res: Response) {
    try {
      const { booking_id } = req.params;
      const headers = req.headers;

      const bearerToken = `${headers.authorization}`.split('Bearer');
      const token = bearerToken[1]?.trim();
      const userJWTData = await AuthService.validateToken(token);
      const { updatedData, count } = await BookingService.GetBookingWithUserIdAndBookingId(userJWTData.userId, parseInt(booking_id, 10));

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: updatedData,
        message: `success showing user ${userJWTData.userId} bookings with booking ID ${booking_id}`,
        meta: { ...defaultMeta, totalData: count }
      });

      return responseData;

    } catch (error: any) {
      res.status(500).json({
        status: 'FAIL',
        message: error.message
      });
    }
  }

  async update(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const result = await BookingService.update(req.body as IBooking);

      return ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success updating booking data'
      });
    } catch (error) {
      next(error);
    }
  }

  async checkIn(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const { booking_id } = req.params;
      const headers = req.headers;

      const bearerToken = `${headers.authorization}`.split('Bearer');
      const token = bearerToken[1]?.trim();
      const userJWTData = await AuthService.validateToken(token);

      const booking = await BookingService.GetBookingWithUserIdAndBookingId(userJWTData.userId, parseInt(booking_id, 10));

      const { map_ticket, passengers } = booking.updatedData[0];

      if (map_ticket[0].boarding_code !== null) {
        return res.status(400).json({
          status: 'FAIL',
          message: 'This ticket has already been Checked in before'
        });
      } else if (booking.updatedData[0].status !== "SUCCESS") {
        return res.status(400).json({
          status: 'FAIL',
          message: `This ticket payment status is ${booking.updatedData[0].status} check in need to be done on paid ticket`
        });
      }

      map_ticket.forEach(async ticket => {
        const updatedTicket = await mapTicketService.update(ticket.map_ticket_id)
        console.log(updatedTicket);
      });

      passengers.forEach(async passenger => {
        const updatedPassenger = await passengerService.update(passenger.passenger_id)
        console.log(updatedPassenger);
      });

      return ResponseBuilder.response({
        res,
        code: 201,
        data: booking,
        message: 'success updating booking data'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserBookingController();
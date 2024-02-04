import { type Request, type Response, type NextFunction } from 'express';
import BookingService from '../../../services/bookingService';
import ResponseBuilder from '../../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../../middlewares/auth';

import { type IRestController } from '../../../interfaces/IRest';
import { ITicket } from '../../../models/ticketModel';
import { ForeignKeyViolationError } from 'objection';
import FlightService from '../../../services/flightService';
import { ICompleteBooking } from '../../../types/Booking';

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

      //   const responseData = ResponseBuilder.response({
      //     res,
      //     code: 201,
      //     data: result,
      //     message: 'success processing user booking'
      //   });

      //   return responseData;

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
}

export default new UserBookingController();
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

  async listAllUserId(req: Request, res: Response) {
    try {
      const headers = req.headers;

      const bearerToken = `${headers.authorization}`.split('Bearer');
      const token = bearerToken[1]?.trim();
      const userJWTData = await AuthService.validateToken(token);
      const { data, count } = await BookingService.listAllUserId(userJWTData.userId);

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: data,
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
}

export default new UserBookingController();
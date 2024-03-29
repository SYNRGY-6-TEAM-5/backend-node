import { type Request, type Response, type NextFunction } from 'express';
import TicketService from '../../services/ticketService';
import PassengerService from '../../services/passengerService';
import ResponseBuilder from '../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../middlewares/auth';

import AuthService from '../../services/authService';

import { IPassenger } from '../../models/passengerModel';

const defaultMeta = {
  page: 1,
  size: 10,
  totalData: 0,
  totalPages: 0
};

class PassengerController {
  constructor() { }
  async create(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const result = await PassengerService.create(req.body as IPassenger);

      const responseData = ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success create a new passenger'
      });

      return responseData;

    } catch (error) {
      next(error);
    }
  }
  
  async listSavedPassenger(req: Request, res: Response) {
    try {
      const headers = req.headers;

      const bearerToken = `${headers.authorization}`.split('Bearer');
      const token = bearerToken[1]?.trim();
      const userJWTData = await AuthService.validateToken(token);

      const { data } = await PassengerService.listSavedPassenger(userJWTData.userId);

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: data,
        message: 'success showing list of all passengers',
        meta: { ...defaultMeta }
      });

      return responseData;

    } catch (error: any) {
      res.status(500).json({
        status: 'FAIL',
        message: error.message
      });
    }
  }
  
  async showSavedPassenger(req: Request, res: Response) {
    try {
      const headers = req.headers;

      const bearerToken = `${headers.authorization}`.split('Bearer');
      const token = bearerToken[1]?.trim();
      const userJWTData = await AuthService.validateToken(token);

      const { saved_passenger_id } = req.params;

      const { data } = await PassengerService.getOneSavedPassenger(parseInt(saved_passenger_id, 10), userJWTData.userId);

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: data,
        message: 'success showing passenger details',
        meta: { ...defaultMeta }
      });

      return responseData;

    } catch (error: any) {
      res.status(500).json({
        status: 'FAIL',
        message: error.message
      });
    }
  }

  // async show(req: Request, res: Response) {
  //   try {
  //     const { passenger_id } = req.params;

  //     const passenger = await PassengerService.get(parseInt(passenger_id, 10));

  //     if (!passenger) {
  //       res.status(404).json({
  //         status: 'FAIL',
  //         message: 'passenger not found'
  //       });
  //       return;
  //     }

  //     const responseData = ResponseBuilder.response({
  //       res,
  //       code: 200,
  //       data: passenger,
  //       message: 'success showing a passenger',
  //       meta: { ...defaultMeta, totalData: 1 }
  //     });

  //     return responseData;

  //   } catch (error: any) {
  //     res.status(422).json({
  //       status: 'FAIL',
  //       message: error.message
  //     });
  //   }
  // }

  // async update(req: IRequestWithAuth, res: Response, next: NextFunction) {
  //   try {
  //     const id = req.params?.passenger_id;

  //     const result = await PassengerService.update(parseInt(id, 10), req.body as IPassenger);

  //     return ResponseBuilder.response({
  //       res,
  //       code: 201,
  //       data: result,
  //       message: 'success updating passenger data'
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async delete(req: Request, res: Response) {
  //   try {
  //     const { passenger_id } = req.params;
  //     await PassengerService.delete(parseInt(passenger_id, 10));
  //     res.status(200).json({
  //       status: 'OK',
  //       message: 'Successfully deleted passenger'
  //     });
  //   } catch (error: any) {
  //     res.status(422).json({
  //       status: 'FAIL',
  //       message: error.message
  //     });
  //   }
  // }
}

export default new PassengerController();
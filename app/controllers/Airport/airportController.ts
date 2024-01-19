import { type Request, type Response, type NextFunction } from 'express';
import AirportService from '../../services/airportService';
import authService from '../../services/authService';
import ResponseBuilder from '../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../middlewares/auth';

import media from '../../config/media';

import { type IRestController } from '../../interfaces/IRest';
import { type IUser } from '../../interfaces/IAuth';
import { type ICar } from '../../models/carsModel';

const defaultMeta = {
  page: 1,
  size: 10,
  totalData: 0,
  totalPages: 0
};

class AirportController implements IRestController {
  constructor() { }
  async list(req: Request, res: Response) {
    try {
      const query = req.query;
      const { data, count } = await AirportService.list(query);

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: data,
        message: 'success showing list of all airports',
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

  async show(req: Request, res: Response) {
    try {
      const { airport_id } = req.params;

      const airport = await AirportService.get(parseInt(airport_id, 10));

      if (!airport) {
        res.status(404).json({
          status: 'FAIL',
          message: 'airport not found'
        });
        return;
      }

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: airport,
        message: 'success showing a airport',
        meta: { ...defaultMeta, totalData: 1 }
      });

      return responseData;

    } catch (error: any) {
      res.status(422).json({
        status: 'FAIL',
        message: error.message
      });
    }
  }

  async create(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const userToken = req.body.userToken;

      const bearerToken = userToken.split('Bearer');
      const token = bearerToken[1]?.trim();

      const userDetails = await authService.validateToken(token);

      AirportService.setUser = userDetails;

      const result = await AirportService.create(req.body as ICar);

      const responseData = ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success create a new departure'
      });

      return responseData;

    } catch (error) {
      next(error);
    }
  }

  async update(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const id = req.params?.car_id;
      const userToken = req.body.userToken;

      const bearerToken = userToken.split('Bearer');
      const token = bearerToken[1]?.trim();

      const userDetails = await authService.validateToken(token);

      AirportService.setUser = userDetails;

      const result = await AirportService.update(parseInt(id, 10), req.body as ICar);

      return ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success updating car data'
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { car_id } = req.params;
      await AirportService.delete(parseInt(car_id, 10));
      res.status(200).json({
        status: 'OK',
        message: 'Successfully deleted car'
      });
    } catch (error: any) {
      res.status(422).json({
        status: 'FAIL',
        message: error.message
      });
    }
  }
}

export default new AirportController();

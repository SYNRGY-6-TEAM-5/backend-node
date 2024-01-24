import { type Request, type Response, type NextFunction } from 'express';
import ArrivalService from '../../services/arrivalService';
import ResponseBuilder from '../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../middlewares/auth';
import { type IRestController } from '../../interfaces/IRest';
import { type IArrival } from '../../models/arrivalModel';

const defaultMeta = {
  page: 1,
  size: 10,
  totalData: 0,
  totalPages: 0
};

class ArrivalController implements IRestController {
  constructor() { }
  async create(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const result = await ArrivalService.create(req.body as IArrival);

      const responseData = ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success create a new arrival'
      });

      return responseData;

    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response) {
    try {
      const query = req.query;
      const { data, count } = await ArrivalService.list(query);

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: data,
        message: 'success showing list of all arrivals',
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
      const { arrival_id } = req.params;

      const departure = await ArrivalService.get(parseInt(arrival_id, 10));

      if (!departure) {
        res.status(404).json({
          status: 'FAIL',
          message: 'arrival not found'
        });
        return;
      }

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: departure,
        message: 'success showing a arrival',
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

  async update(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const id = req.params?.arrival_id;

      const result = await ArrivalService.update(parseInt(id, 10), req.body as IArrival);

      return ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success updating arrival data'
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { arrival_id } = req.params;
      await ArrivalService.delete(parseInt(arrival_id, 10));
      res.status(200).json({
        status: 'OK',
        message: 'Successfully deleted arrival'
      });
    } catch (error: any) {
      res.status(422).json({
        status: 'FAIL',
        message: error.message
      });
    }
  }
}

export default new ArrivalController();

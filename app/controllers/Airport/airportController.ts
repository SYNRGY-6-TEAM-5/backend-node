import { type Request, type Response, type NextFunction } from 'express';
import AirportService from '../../services/airportService';
import authService from '../../services/authService';
import ResponseBuilder from '../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../middlewares/auth';

import { type IRestController } from '../../interfaces/IRest';
import { type IAirport } from '../../models/airportModel';
import { ForeignKeyViolationError } from 'objection';

const defaultMeta = {
  page: 1,
  size: 10,
  totalData: 0,
  totalPages: 0
};

class AirportController implements IRestController {
  constructor() { }
  async create(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const result = await AirportService.create(req.body as IAirport);

      const responseData = ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success create a new airport'
      });

      return responseData;

    } catch (error: any) {
      if (error instanceof ForeignKeyViolationError) {
        return res.status(422).json({
          status: 'FAIL',
          message: "Failed create airport",
          server_log: error.message
        });
      } else {
        return res.status(500).json({
          status: 'FAIL',
          message: "Failed create airport",
          server_log: error.message
        });
      }
    }
  }

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

  async update(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const id = req.params?.airport_id;

      const airportExists = await AirportService.get(parseInt(id, 10));
      if (!airportExists) {
        return res.status(422).json({
          status: 'FAIL',
          message: `Airport with ID ${id} not found in the database`
        });
      }
        const result = await AirportService.update(parseInt(id, 10), req.body as IAirport);

        return ResponseBuilder.response({
          res,
          code: 201,
          data: result,
          message: 'success updating airport data'
        });

    } catch (error: any) {
      if (error instanceof ForeignKeyViolationError) {
        return res.status(422).json({
          status: 'FAIL',
          message: "Failed update airport",
          server_log: error.message
        });
      } else {
        return res.status(500).json({
          status: 'FAIL',
          message: "Failed update airport",
          server_log: error.message
        });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { airport_id } = req.params;

      const deletedAirportId = await AirportService.delete(parseInt(airport_id, 10));

      if (deletedAirportId !== undefined) {
        res.status(200).json({
          status: 'OK',
          message: 'Successfully deleted airport'
        });
      } else {
        return res.status(404).json({
          status: 'FAIL',
          message: `Airport with ID ${airport_id} is not found in database`
        });
      }

    } catch (error: any) {
      return res.status(500).json({
        status: 'FAIL',
        message: "Failed delete airport",
        server_log: error.message
      });
    }
  }
}

export default new AirportController();

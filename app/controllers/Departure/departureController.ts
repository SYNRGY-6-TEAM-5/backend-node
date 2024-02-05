import { type Request, type Response, type NextFunction } from 'express';
import AirportService from '../../services/airportService';
import DepartureService from '../../services/departureService';
import ResponseBuilder from '../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../middlewares/auth';
import { type IRestController } from '../../interfaces/IRest';
import { type IDeparture } from '../../models/departureModel';
import { ForeignKeyViolationError } from 'objection';

const defaultMeta = {
  page: 1,
  size: 10,
  totalData: 0,
  totalPages: 0
};

class DepartureController implements IRestController {
  constructor() { }
  async create(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const result = await DepartureService.create(req.body as IDeparture);

      const responseData = ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success create a new departure'
      });

      return responseData;

    } catch (error: any) {
      if (error instanceof ForeignKeyViolationError) {
        return res.status(422).json({
          status: 'FAIL',
          message: "Failed create departure",
          server_log: error.message
        });
      } else {
        return res.status(500).json({
          status: 'FAIL',
          message: "Failed create departure",
          server_log: error.message
        });
      }
    }
  }

  async list(req: Request, res: Response) {
    try {
      const query = req.query;
      const { data, count } = await DepartureService.list(query);

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: data,
        message: 'success showing list of all departures',
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
      const { departure_id } = req.params;

      const departure = await DepartureService.get(parseInt(departure_id, 10));

      if (!departure) {
        res.status(404).json({
          status: 'FAIL',
          message: 'departure not found'
        });
        return;
      }

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: departure,
        message: 'success showing a departure',
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
      const id = req.params?.departure_id;
      const { airport_id } = req.body
      const airportWithId = await AirportService.get(parseInt(airport_id, 10));

      const departureExists = await DepartureService.get(parseInt(id, 10));
      if (!departureExists) {
        return res.status(422).json({
          status: 'FAIL',
          message: `Departure with ID ${id} not found in the database`
        });
      }

      if (airportWithId) {
        const result = await DepartureService.update(parseInt(id, 10), req.body as IDeparture);

        return ResponseBuilder.response({
          res,
          code: 201,
          data: result,
          message: 'success updating departure data'
        });
      } else {
        return res.status(422).json({
          status: 'FAIL',
          message: `Airport with ID ${airport_id} is not found in database`
        });
      }

    } catch (error: any) {
      if (error instanceof ForeignKeyViolationError) {
        return res.status(422).json({
          status: 'FAIL',
          message: "Failed update departure",
          server_log: error.message
        });
      } else {
        return res.status(500).json({
          status: 'FAIL',
          message: "Failed update departure",
          server_log: error.message
        });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { departure_id } = req.params;

      const deletedDepartId = await DepartureService.delete(parseInt(departure_id, 10));

      if (deletedDepartId !== undefined) {
        res.status(200).json({
          status: 'OK',
          message: 'Successfully deleted departure'
        });
      } else {
        return res.status(404).json({
          status: 'FAIL',
          message: `Departure with ID ${departure_id} is not found in database`
        });
      }

    } catch (error: any) {
      return res.status(500).json({
        status: 'FAIL',
        message: "Failed delete departure",
        server_log: error.message
      });
    }
  }
}

export default new DepartureController();

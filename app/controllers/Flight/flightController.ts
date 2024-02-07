import { type Request, type Response, type NextFunction } from 'express';
import FlightService from '../../services/flightService';
import authService from '../../services/authService';
import ResponseBuilder from '../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../middlewares/auth';

import { type IRestController } from '../../interfaces/IRest';
import { type IFlight } from '../../models/flightModel';

const defaultMeta = {
  page: 1,
  size: 10,
  totalData: 0,
  totalPages: 0
};

class FlightController implements IRestController {
  constructor() { }
  async create(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const result = await FlightService.create(req.body as IFlight);

      const responseData = ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success create a new flight'
      });

      return responseData;

    } catch (error) {
      next(error);
    }
  }
  
  async list(req: Request, res: Response) {
    try {
      const query = req.query;
      const { data, count } = await FlightService.list(query);

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: data,
        message: 'success showing list of all flights',
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
      const { flight_id } = req.params;
      console.log(flight_id);

      const flight = await FlightService.get(parseInt(flight_id, 10));

      if (!flight) {
        res.status(404).json({
          status: 'FAIL',
          message: 'flight not found'
        });
        return;
      }

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: flight,
        message: 'success showing a flight',
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
      const id = req.params?.flight_id;

      const flightExists = await FlightService.get(parseInt(id, 10));
      if (!flightExists) {
        return res.status(422).json({
          status: 'FAIL',
          message: `Flight with ID ${id} not found in the database`
        });
      }

      const result = await FlightService.update(parseInt(id, 10), req.body as IFlight);

      return ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success updating flight data'
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { flight_id } = req.params;

      const deletedFlightId = await FlightService.delete(parseInt(flight_id, 10));

      if (deletedFlightId !== undefined) {
        res.status(200).json({
          status: 'OK',
          message: 'Successfully deleted flight'
        });
      } else {
        return res.status(404).json({
          status: 'FAIL',
          message: `Flight with ID ${flight_id} is not found in database`
        });
      }

    } catch (error: any) {
      return res.status(500).json({
        status: 'FAIL',
        message: "Failed delete flight",
        server_log: error.message
      });
    }
  }
}

export default new FlightController();
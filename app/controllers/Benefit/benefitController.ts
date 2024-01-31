import { type Request, type Response, type NextFunction } from 'express';
import BenefitService from '../../services/benefitService';
import ResponseBuilder from '../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../middlewares/auth';

import { type IRestController } from '../../interfaces/IRest';
import { type IBenefit } from '../../models/benefitModel';
import { ForeignKeyViolationError } from 'objection';
import FlightService from '../../services/flightService';

const defaultMeta = {
  page: 1,
  size: 10,
  totalData: 0,
  totalPages: 0
};

class BenefitController implements IRestController {
  constructor() { }

  async create(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const result = await BenefitService.create(req.body as IBenefit);

      const responseData = ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success create a new benefit'
      });

      return responseData;

    } catch (error: any) {
      if (error instanceof ForeignKeyViolationError) {
        return res.status(422).json({
          status: 'FAIL',
          message: "Failed create benefit",
          server_log: error.message
        });
      } else {
        return res.status(500).json({
          status: 'FAIL',
          message: "Failed create benefit",
          server_log: error.message
        });
      }
    }
  }
  
  async list(req: Request, res: Response) {
    try {
      const query = req.query;
      const { data, count } = await BenefitService.list(query);

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: data,
        message: 'success showing list of all benefits',
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
      const { benefit_id } = req.params;

      const benefit = await BenefitService.get(parseInt(benefit_id, 10));

      if (!benefit) {
        res.status(404).json({
          status: 'FAIL',
          message: 'benefit not found'
        });
        return;
      }

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: benefit,
        message: 'success showing a benefit',
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
      const id = req.params?.benefit_id;
      const { flight_id } = req.body
      const flightWithId = await FlightService.get(parseInt(flight_id, 10));

      const benefitExists = await BenefitService.get(parseInt(id, 10));
      if (!benefitExists) {
        return res.status(422).json({
          status: 'FAIL',
          message: `Benefit with ID ${id} not found in the database`
        });
      }

      if (flightWithId) {
        const result = await BenefitService.update(parseInt(id, 10), req.body as IBenefit);

        return ResponseBuilder.response({
          res,
          code: 201,
          data: result,
          message: 'success updating benefit data'
        });
      } else {
        return res.status(422).json({
          status: 'FAIL',
          message: `Flight with ID ${flight_id} is not found in database`
        });
      }

    } catch (error: any) {
      if (error instanceof ForeignKeyViolationError) {
        return res.status(422).json({
          status: 'FAIL',
          message: "Failed update benefit",
          server_log: error.message
        });
      } else {
        return res.status(500).json({
          status: 'FAIL',
          message: "Failed update benefit",
          server_log: error.message
        });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { benefit_id } = req.params;

      const deletedBenefitId = await BenefitService.delete(parseInt(benefit_id, 10));

      if (deletedBenefitId !== undefined) {
        res.status(200).json({
          status: 'OK',
          message: 'Successfully deleted benefit'
        });
      } else {
        return res.status(404).json({
          status: 'FAIL',
          message: `Benefit with ID ${benefit_id} is not found in database`
        });
      }

    } catch (error: any) {
      return res.status(500).json({
        status: 'FAIL',
        message: "Failed delete benefit",
        server_log: error.message
      });
    }
  }
}

export default new BenefitController();

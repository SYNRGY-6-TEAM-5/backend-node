import { type Request, type Response, type NextFunction } from 'express';
import BenefitService from '../../services/benefitService';
import ResponseBuilder from '../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../middlewares/auth';

import { type IRestController } from '../../interfaces/IRest';
import { type IBenefit } from '../../models/benefitModel';

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

    } catch (error) {
      next(error);
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

      const result = await BenefitService.update(parseInt(id, 10), req.body as IBenefit);

      return ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success updating benefit data'
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { benefit_id } = req.params;
      await BenefitService.delete(parseInt(benefit_id, 10));
      res.status(200).json({
        status: 'OK',
        message: 'Successfully deleted benefit'
      });
    } catch (error: any) {
      res.status(422).json({
        status: 'FAIL',
        message: error.message
      });
    }
  }
}

export default new BenefitController();

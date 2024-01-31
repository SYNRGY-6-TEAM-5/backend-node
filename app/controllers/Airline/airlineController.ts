import { type Request, type Response, type NextFunction } from 'express';
import AirlineService from '../../services/airlineService';
import ResponseBuilder from '../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../middlewares/auth';

import media from '../../config/media';

import { type IRestController } from '../../interfaces/IRest';
import { type IAirline } from '../../models/airlineModel';
import { ForeignKeyViolationError, ValidationError } from 'objection';

const defaultMeta = {
  page: 1,
  size: 10,
  totalData: 0,
  totalPages: 0
};

class AirlineController implements IRestController {
  constructor() { }

  async upload(req: IRequestWithAuth, res: Response) {
    try {
      if (req.file) {
        const fileBase64 = req.file.buffer.toString('base64');
        const file = `data:${req.file.mimetype};base64,${fileBase64}`;
        const resultUpload = await media.storage.uploader.upload(file, (err, result) => {
          if (err) {
            return ResponseBuilder.response({
              code: 403,
              res,
              data: 'failed upload to storage'
            });
          }
          return result;
        });

        return ResponseBuilder.response({
          code: 200,
          res,
          data: resultUpload
        });
      }

      ResponseBuilder.response({
        code: 404,
        res,
        data: 'file not found'
      });
    } catch (error) {
      ResponseBuilder.response({
        code: 500,
        data: 'upload failed',
        res
      });
    }
  };

  async create(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const result = await AirlineService.create(req.body as IAirline);

      const responseData = ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success create a new airline'
      });

      return responseData;

    } catch (error: any) {
      if (error instanceof ForeignKeyViolationError) {
        return res.status(422).json({
          status: 'FAIL',
          message: "Failed create airline",
          server_log: error.message
        });
      } else {
        return res.status(500).json({
          status: 'FAIL',
          message: "Failed create airline",
          server_log: error.message
        });
      }
    }
  }

  async list(req: Request, res: Response) {
    try {
      const query = req.query;
      const { data, count } = await AirlineService.list(query);

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: data,
        message: 'success showing list of all airlines',
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
      const { airline_id } = req.params;

      const airline = await AirlineService.get(parseInt(airline_id, 10));

      if (!airline) {
        res.status(404).json({
          status: 'FAIL',
          message: 'airline not found'
        });
        return;
      }

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: airline,
        message: 'success showing a airline',
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
      const id = req.params?.airline_id;

      const airlineExists = await AirlineService.get(parseInt(id, 10));
      if (!airlineExists) {
        return res.status(422).json({
          status: 'FAIL',
          message: `Airline with ID ${id} not found in the database`
        });
      }
        const result = await AirlineService.update(parseInt(id, 10), req.body as IAirline);

        return ResponseBuilder.response({
          res,
          code: 201,
          data: result,
          message: 'success updating airline data'
        });

    } catch (error: any) {
      if (error instanceof ForeignKeyViolationError) {
        return res.status(422).json({
          status: 'FAIL',
          message: "Failed update airline",
          server_log: error.message
        });
      } else {
        return res.status(500).json({
          status: 'FAIL',
          message: "Failed update airline",
          server_log: error.message
        });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { airline_id } = req.params;

      const deletedAirlineId = await AirlineService.delete(parseInt(airline_id, 10));

      if (deletedAirlineId !== undefined) {
        res.status(200).json({
          status: 'OK',
          message: 'Successfully deleted airline'
        });
      } else {
        return res.status(404).json({
          status: 'FAIL',
          message: `Airline with ID ${airline_id} is not found in database`
        });
      }

    } catch (error: any) {
      return res.status(500).json({
        status: 'FAIL',
        message: "Failed delete airline",
        server_log: error.message
      });
    }
  }
}

export default new AirlineController();

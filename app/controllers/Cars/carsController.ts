import { type Request, type Response, type NextFunction } from 'express';
import CarsService from '../../services/carsService'; // Import the created service
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

class CarsController implements IRestController {
  constructor() { }
  async list(req: Request, res: Response) {
    try {
      const query = req.query;
      const { data, count } = await CarsService.list(query);

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: data,
        message: 'success showing list of all cars',
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
      const { car_id } = req.params;

      const car = await CarsService.get(parseInt(car_id, 10));

      if (!car) {
        res.status(404).json({
          status: 'FAIL',
          message: 'Car not found'
        });
        return;
      }

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: car,
        message: 'success showing a car',
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
      const userToken = req.body.userToken;

      const bearerToken = userToken.split('Bearer');
      const token = bearerToken[1]?.trim();

      const userDetails = await authService.validateToken(token);

      CarsService.setUser = userDetails;

      const result = await CarsService.create(req.body as ICar);

      const responseData = ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success create a new car'
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

      CarsService.setUser = userDetails;

      const result = await CarsService.update(parseInt(id, 10), req.body as ICar);

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
      await CarsService.delete(parseInt(car_id, 10));
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

export default new CarsController();

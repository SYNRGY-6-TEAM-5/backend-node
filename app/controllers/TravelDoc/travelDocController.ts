import { type Request, type Response, type NextFunction } from 'express';
import TravelDocService from '../../services/travleDocService';
import UserRepository from '../../repositories/userRepository';
import AuthService from '../../services/authService';
import ResponseBuilder from '../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../middlewares/auth';

import media from '../../config/media';

import { type IRestController } from '../../interfaces/IRest';
import { ITravelDoc } from '../../models/travelDocModel';

const defaultMeta = {
  page: 1,
  size: 10,
  totalData: 0,
  totalPages: 0
};

class TravelDocController implements IRestController {
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
      const headers = req.headers;

      if (!headers.authorization) {
        return res.status(403).json({
          data: 'no auth header, not authorized'
        });
      }

      const bearerToken = `${headers.authorization}`.split('Bearer');
      const token = bearerToken[1]?.trim();
      const userJWTData = await AuthService.validateToken(token);

      const userData = await UserRepository.findByEmail(userJWTData.sub);
      console.log(userData);

      const result = await TravelDocService.create(req.body as ITravelDoc);

      const responseData = ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success create a new travel doc'
      });

      return responseData;

    } catch (error) {
      next(error);
    }
  }
  
  async list(req: Request, res: Response) {
    try {
      const query = req.query;
      const { data, count } = await TravelDocService.list(query);

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: data,
        message: 'success showing list of all travel docs',
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
      const { travel_doc_id } = req.params;

      const travelDoc = await TravelDocService.get(parseInt(travel_doc_id, 10));

      if (!travelDoc) {
        res.status(404).json({
          status: 'FAIL',
          message: 'travel doc not found'
        });
        return;
      }

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: travelDoc,
        message: 'success showing a travel doc',
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
      const id = req.params?.travel_doc_id;

      const result = await TravelDocService.update(parseInt(id, 10), req.body as ITravelDoc);

      return ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success updating travel doc data'
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { travel_doc_id } = req.params;
      await TravelDocService.delete(parseInt(travel_doc_id, 10));
      res.status(200).json({
        status: 'OK',
        message: 'Successfully deleted travel doc'
      });
    } catch (error: any) {
      res.status(422).json({
        status: 'FAIL',
        message: error.message
      });
    }
  }
}

export default new TravelDocController();

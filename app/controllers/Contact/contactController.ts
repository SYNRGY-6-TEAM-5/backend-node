import { type Request, type Response, type NextFunction } from 'express';
import ContactDetailsService from '../../services/contactService';
import ResponseBuilder from '../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../middlewares/auth';
import { IContactDetails } from '../../models/contactModel';

class ContactController {
  constructor() { }
  async create(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const result = await ContactDetailsService.create(req.body as IContactDetails);

      const responseData = ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success create a new contact details'
      });

      return responseData;

    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { contact_id } = req.params;
      await ContactDetailsService.delete(parseInt(contact_id, 10));
      res.status(200).json({
        status: 'OK',
        message: 'Successfully deleted contact details'
      });
    } catch (error: any) {
      res.status(422).json({
        status: 'FAIL',
        message: error.message
      });
    }
  }
}

export default new ContactController();
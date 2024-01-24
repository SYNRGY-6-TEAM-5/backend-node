import { type Request, type Response, type NextFunction } from 'express';
import TicketService from '../../services/ticketService';
import ResponseBuilder from '../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../middlewares/auth';

import { type IRestController } from '../../interfaces/IRest';
import { type IFlight } from '../../models/flightModel';
import { ITicket } from '../../models/ticketModel';

const defaultMeta = {
  page: 1,
  size: 10,
  totalData: 0,
  totalPages: 0
};

class TicketController implements IRestController {
  constructor() { }
  async create(req: IRequestWithAuth, res: Response, next: NextFunction) {
    try {
      const result = await TicketService.create(req.body as ITicket);

      const responseData = ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success create a new ticket'
      });

      return responseData;

    } catch (error) {
      next(error);
    }
  }
  
  async list(req: Request, res: Response) {
    try {
      const query = req.query;
      const { data, count } = await TicketService.list(query);

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: data,
        message: 'success showing list of all tickets',
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
      const { ticket_id } = req.params;

      const ticket = await TicketService.get(parseInt(ticket_id, 10));

      if (!ticket) {
        res.status(404).json({
          status: 'FAIL',
          message: 'ticket not found'
        });
        return;
      }

      const responseData = ResponseBuilder.response({
        res,
        code: 200,
        data: ticket,
        message: 'success showing a ticket',
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
      const id = req.params?.ticket_id;

      const result = await TicketService.update(parseInt(id, 10), req.body as ITicket);

      return ResponseBuilder.response({
        res,
        code: 201,
        data: result,
        message: 'success updating ticket data'
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { ticket_id } = req.params;
      await TicketService.delete(parseInt(ticket_id, 10));
      res.status(200).json({
        status: 'OK',
        message: 'Successfully deleted ticket'
      });
    } catch (error: any) {
      res.status(422).json({
        status: 'FAIL',
        message: error.message
      });
    }
  }
}

export default new TicketController();
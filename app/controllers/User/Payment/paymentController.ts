import { type Request, type Response, type NextFunction } from 'express';
import ResponseBuilder from '../../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../../middlewares/auth';
import PaymentService from '../../../services/paymentService';
import AuthService from '../../../services/authService';

class PaymentController {
    constructor() { }
    async create(req: IRequestWithAuth, res: Response, next: NextFunction) {
        try {
            const booking_id = req.params?.booking_id;
            const headers = req.headers;

            const bearerToken = `${headers.authorization}`.split('Bearer');
            const token = bearerToken[1]?.trim();
            const userJWTData = await AuthService.validateToken(token);
            const user_id = userJWTData.userId;

            const payload = req.body;

            const result = await PaymentService.create(parseInt(booking_id, 10), user_id, payload);

            const responseData = ResponseBuilder.response({
                res,
                code: 201,
                data: result,
                message: 'success changing user booking status to paid'
            });

            return responseData;

        } catch (error) {
            next(error);
        }
    }
}

export default new PaymentController();
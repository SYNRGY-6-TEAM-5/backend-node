import { type Response, type NextFunction } from 'express';
import ResponseBuilder from '../../utils/ResponseBuilder';

import { type IRequestWithAuth } from '../../middlewares/auth';

import { ForeignKeyViolationError } from 'objection';
import AuthService from '../../services/authService';
import schedule from '../../services/notificationService';

class UserBookingController {
    constructor() { }

    async schedule(req: IRequestWithAuth, res: Response, next: NextFunction) {
        try {
            const headers = req.headers;

            const bearerToken = `${headers.authorization}`.split('Bearer');
            const token = bearerToken[1]?.trim();
            const userJWTData = await AuthService.validateToken(token);

            const payload = {
                time: req.body.time,
                days: req.body.days,
                title: req.body.title,
                body: req.body.body,
            };

            const result = await schedule.createSchedule(userJWTData.userId, payload)

            const responseData = ResponseBuilder.response({
                res,
                code: 201,
                data: result,
                message: 'success creating user notification scheduler'
            });

            return responseData;

        } catch (error: any) {
            if (error instanceof ForeignKeyViolationError) {
                return res.status(422).json({
                    status: 'FAIL',
                    message: "Failed processing user notification scheduler",
                    server_log: error.message
                });
            } else {
                return res.status(500).json({
                    status: 'FAIL',
                    message: "Failed processing user notification scheduler",
                    server_log: error.message
                });
            }
        }
    }
}

export default new UserBookingController();
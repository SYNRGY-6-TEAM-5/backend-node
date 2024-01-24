import { type Request, type Response, type NextFunction } from 'express';
import { type IUser } from '../interfaces/IAuth';

import AuthService from '../services/authService';

export interface IRequestWithAuth extends Request {
  user?: IUser;
}

class AuthMiddleware {
  constructor() {}

  async authorizeSuperAdmin(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;

    if (!headers.authorization) {
      return res.status(403).json({
        data: 'not authorized'
      });
    }

    const bearerToken = `${headers.authorization}`.split('Bearer');
    const token = bearerToken[1]?.trim();
    const userJWTData = await AuthService.validateToken(token);
    const isSuperAdmin = await AuthService.validateRole(userJWTData, 'superadmin');

    if (!isSuperAdmin) {
      return res.status(403).json({
        data: 'not authorized'
      });
    }

    next();
  }

  async authorizeAdmin(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;

    if (!headers.authorization) {
      return res.status(403).json({
        data: 'no auth header, not authorized'
      });
    }

    const bearerToken = `${headers.authorization}`.split('Bearer');
    const token = bearerToken[1]?.trim();
    const userJWTData = await AuthService.validateToken(token);
    const isAdmin = await AuthService.validateRole(userJWTData, 'ADMIN');

    if (!isAdmin) {
      return res.status(403).json({
        data: 'not authorized'
      });
    }

    next();
  }
}

export default new AuthMiddleware();

import { Request, Response } from 'express';
import googleOAuthService from '../../services/googleOAuthService';
import ResponseBuilder from '../../utils/ResponseBuilder';

class GoogleOAuthController {
  constructor() {}
  async handleGoogleLoginOrRegister(req: Request, res: Response) {
    const { access_token } = req.body;
    const options = { headers: { Authorization: `Bearer ${access_token}` } };

    const result = await googleOAuthService.handleOAuth(options);

    const responseData = ResponseBuilder.response({
      res,
      code: 201,
      data: result,
      message: 'success create a new passenger'
    });

    return responseData;
  }
}

export default new GoogleOAuthController();

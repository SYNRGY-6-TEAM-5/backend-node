import { Router } from 'express';
import googleOauthController from '../../controllers/OAuth/googleOauthController';

class GoogleOAuthAPI {
  private readonly router: Router;

  constructor() {
    this.router = Router();
  }

  routes() {
    /**
     * @openapi
     * /api/cars/:
     *  get:
     *     tags:
     *     - CRUD - List All Cars
     *     description: Responds if the app is up and running
     *     responses:
     *       200:
     *         description: App is up and running
     */
    this.router.post('/', googleOauthController.handleGoogleLoginOrRegister); // /api/books READ

    return this.router;
  }
}

export default new GoogleOAuthAPI();

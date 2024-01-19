import { Router } from 'express';

import AuthController from '../../controllers/Auth/authController';
import AuthMiddleware from '../../middlewares/auth';

class AuthApi {
  private readonly router: Router;

  constructor() {
    this.router = Router();
  }

  routes() {
    /**
     * @openapi
     * '/api/user/login':
     *  post:
     *     tags:
     *     - Auth - User Login
     *     summary: User Login Authenticaton
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *              $ref: '#/components/schemas/LoginUserInput'
     *     responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/LoginUserResponse'
     *      409:
     *        description: Conflict
     *      400:
     *        description: Bad request
     */
    this.router.post('/login', AuthController.login);

    this.router.get('/user-data', AuthMiddleware.authorizeAdmin, AuthController.getUserData);

    /**
     * @openapi
     * '/api/user/register':
     *  post:
     *     tags:
     *     - Auth - User Registration
     *     summary: Register a user
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *              $ref: '#/components/schemas/CreateUserInput'
     *     responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/CreateUserResponse'
     *      409:
     *        description: Conflict
     *      400:
     *        description: Bad request
     */
    this.router.post('/register', AuthController.register);

    /**
     * @openapi
     * '/api/user/register-admin':
     *  post:
     *     tags:
     *     - Auth - Admin User Registration
     *     summary: Register a user admin, Only Accessible by superadmin
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *              $ref: '#/components/schemas/CreateUserInput'
     *     responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/CreateUserResponse'
     *      409:
     *        description: Conflict
     *      400:
     *        description: Bad request
     */
    this.router.post(
      '/register-admin',
      AuthMiddleware.authorizeSuperAdmin,
      AuthController.registerAdmin
    );

    return this.router;
  }
}

export default new AuthApi();

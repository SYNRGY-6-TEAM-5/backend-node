import { Router } from 'express';

import PaymentController from '../../controllers/User/Payment/paymentController';

import AuthMiddleware from '../../middlewares/auth';

class UserBookingApi {
  private readonly router: Router;

  constructor() {
    this.router = Router();
  }

  routes() {
    this.router.post('/user/payment/:booking_id', AuthMiddleware.authorizeUser, PaymentController.create);
    
    return this.router;
  }
}

export default new UserBookingApi();
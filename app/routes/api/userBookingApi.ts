import { Router } from 'express';

import BookingController from '../../controllers/User/Booking/bookingController';

import AuthMiddleware from '../../middlewares/auth';

class UserBookingApi {
  private readonly router: Router;

  constructor() {
    this.router = Router();
  }

  routes() {
    this.router.post('/', AuthMiddleware.authorizeUser, BookingController.create);
    
    this.router.get('/', AuthMiddleware.authorizeUser, BookingController.listAllUserId);
    
    return this.router;
  }
}

export default new UserBookingApi();
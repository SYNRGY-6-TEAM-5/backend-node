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
    
    this.router.get('/', AuthMiddleware.authorizeUser, BookingController.listAllBookingWithUserUserId);
    
    this.router.get('/:booking_id', AuthMiddleware.authorizeUser, BookingController.showBookingWithUserUserIdAndBookingId);
    
    this.router.put('/:booking_id', AuthMiddleware.authorizeUser, BookingController.update);
    
    this.router.put('/check-in/:booking_id', AuthMiddleware.authorizeUser, BookingController.checkIn);
    
    return this.router;
  }
}

export default new UserBookingApi();
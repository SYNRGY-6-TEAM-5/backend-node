import express, { Router } from 'express';
import NotificationController from '../../controllers/Notification/notificationController';
import AuthMiddleWare from '../../middlewares/auth';

class NotificationApi {
  private readonly router: Router;

  constructor() {
    this.router = Router();
  }

  routes() {
    this.router.post('/create-schedule', AuthMiddleWare.authorizeUser, NotificationController.schedule);
    
    return this.router;
  }
}

export default new NotificationApi();


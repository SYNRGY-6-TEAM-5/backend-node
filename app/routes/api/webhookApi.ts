import { Router } from 'express';

import PaymentController from '../../controllers/User/Payment/paymentController';

import AuthMiddleware from '../../middlewares/auth';
import WebhookController from '../../controllers/Webhook/webhookController';

class WebhookApi {
  private readonly router: Router;

  constructor() {
    this.router = Router();
  }

  routes() {
    this.router.post('/stripe/pay-webhook', WebhookController.handleStripeEvent);
    
    return this.router;
  }
}

export default new WebhookApi();


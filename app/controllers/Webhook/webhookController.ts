import { Request, Response, NextFunction } from 'express';
import stripe from 'stripe';
import BookingService from '../../services/bookingService';
import NotificationService from '../../services/notificationService';

const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

class WebhookController {
    constructor() { }
    async handleStripeEvent(req: Request, res: Response, next: NextFunction) {
        let event = req.body;
        if (stripeWebhookSecret) {
            const signature = req.headers['stripe-signature'] as string;
            try {
                event = stripe.webhooks.constructEvent(
                    req.body,
                    signature,
                    stripeWebhookSecret
                );
            } catch (err: any) {
                console.log(`⚠️  Webhook signature verification failed.`, err.message);
                return res.sendStatus(400);
            }
        }
        try {
            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object;

                    const userId = event.data.object.metadata.user_id;

                    const notificationPayload = {
                        title: event.data.object.status,
                        body: `Your ${event.data.object.payment_method_types[0]} payment is Successful`,
                    };

                    await NotificationService.sendDirectNotification(userId, notificationPayload);
                    await BookingService.update(paymentIntent);
                    break;
                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }
            res.status(200).end();
        } catch (error: any) {
            console.error('Error handling webhook event:', error.message);
            res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }
}

export default new WebhookController();

import { Request, Response, NextFunction } from 'express';
import stripe from 'stripe';
import ResponseBuilder from '../../utils/ResponseBuilder';
import paymentService from '../../services/paymentService';
import BookingService from '../../services/bookingService';

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
                    // Extract booking_id from metadata of payment intent
                    const booking_id = parseInt(paymentIntent.metadata.booking_id, 10);
                    // Update booking status to paid in your database
                    await BookingService.update(paymentIntent);
                    break;
                // Handle other event types if needed
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

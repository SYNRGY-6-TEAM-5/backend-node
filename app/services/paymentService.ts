import BookingRepository from '../repositories/bookingRepository';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

class PaymentService {
    constructor() { }

    async create(booking_id: number, user_id: string, requestBody: any) {
        try {

            const userBooking = await BookingRepository.findOne(user_id, booking_id);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: userBooking.total_amount * 100,
                currency: 'idr',
                customer: requestBody.contact_details.email,
                metadata: {
                    user_id: userBooking.user_id,
                    booking_id: userBooking.booking_id,
                    user_name: requestBody.contact_details.fullName,
                    email: requestBody.contact_details.email,
                    phone: requestBody.contact_details.phone,
                },
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            return await { 
                clientSecret: paymentIntent.client_secret, 
                customer: paymentIntent.customer, 
                metadata: paymentIntent.metadata 
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

export default new PaymentService();
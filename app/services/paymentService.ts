import { type IUser } from '../interfaces/IAuth';
import BookingRepository from '../repositories/bookingRepository';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

class PaymentService {
    constructor() { }

    async create(booking_id: number, user_id: string) {
        try {

            const userOldBooking = await BookingRepository.findOne(user_id, booking_id);

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: [
                    {
                        price_data: {
                            currency: "idr",
                            product_data: {
                                name: userOldBooking.user_id,
                            },
                            unit_amount: userOldBooking.total_amount,
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                success_url: "http://localhost:3000/success",
                cancel_url: "http://localhost:3000/cancel",
            });

            console.log(session);

            return await {
                session_id: session.id
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

export default new PaymentService();
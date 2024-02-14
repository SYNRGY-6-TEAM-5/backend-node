import express, { NextFunction, type Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import "express-async-errors";

dotenv.config();

import ErrorHandlerMiddleware from './middlewares/error';

import HealthApi from './routes/api/healthApi';
import DepartureApi from './routes/api/departureApi';
import ArrivalApi from './routes/api/arrivalApi';
import AirportApi from './routes/api/airportApi';
import AirlineApi from './routes/api/airlineApi';
import FlightApi from './routes/api/flightApi';
import BenefitApi from './routes/api/benefitApi';
import TicketApi from './routes/api/ticketApi';
import UserBookingAPI from './routes/api/userBookingApi';
import UserPaymentApi from './routes/api/userPaymentApi';
import WebhookApi from './routes/api/webhookApi';
import NotificationApi from './routes/api/notificationApi';
import PassengerApi from './routes/api/passengerApi';
import TravelDocAdminApi from './routes/api/travelDocAdminApi';
import TravelDocUserApi from './routes/api/travelDocUserApi';
import swaggerDocs from './utils/swagger';
import googleOAuthApi from './routes/api/googleOAuthApi';

const { PORT = 8060 } = process.env;
const PUBLIC_DIR = path.join(__dirname, 'public');

class Server {
  public readonly app: Express;

  constructor() {
    this.app = express();
    this.app.use(express.static(PUBLIC_DIR));

    this.app.use('/api/webhook', WebhookApi.routes());
    
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());

    
    this.app.use('/api/health', HealthApi.routes());
    this.app.use('/api/departure', DepartureApi.routes());
    this.app.use('/api/arrival', ArrivalApi.routes());
    this.app.use('/api/airport', AirportApi.routes());
    this.app.use('/api/airline', AirlineApi.routes());
    this.app.use('/api/flight', FlightApi.routes());
    this.app.use('/api/benefit', BenefitApi.routes());
    this.app.use('/api/user/booking', UserBookingAPI.routes());
    this.app.use('/api/user/payment', UserPaymentApi.routes());
    this.app.use('/api/user/notification', NotificationApi.routes());
    this.app.use('/api/passenger', PassengerApi.routes());
    this.app.use('/api/ticket', TicketApi.routes());
    this.app.use('/api/travel-docs/admin', TravelDocAdminApi.routes());
    this.app.use('/api/travel-docs/user', TravelDocUserApi.routes());
    this.app.use('/api/g-auth', googleOAuthApi.routes());
    
    this.app.use(ErrorHandlerMiddleware.errorHandler);
    
    swaggerDocs(this.app, 8000);
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log('Server running on http://0.0.0.0:%s', PORT);
    });
  }
}

console.log('Env URL >>>', process.env.DATABASE_URL);

const server = new Server();
server.start();

export default server.app;

import express, { type Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
dotenv.config();

import HealthApi from './routes/api/healthApi';
import CarsApi from './routes/api/carsApi';
import swaggerDocs from './utils/swagger';
import AirportApi from './routes/api/airportApi';
import AirlineApi from './routes/api/airlineApi';

const { PORT = 8060 } = process.env;
const PUBLIC_DIR = path.join(__dirname, 'public');

class Server {
  public readonly app: Express;

  constructor() {
    this.app = express();
    this.app.use(express.static(PUBLIC_DIR));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());

    this.app.use('/api/health', HealthApi.routes());
    this.app.use('/api/cars', CarsApi.routes());
    this.app.use('/api/airport', AirportApi.routes());
    this.app.use('/api/airline', AirlineApi.routes());

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

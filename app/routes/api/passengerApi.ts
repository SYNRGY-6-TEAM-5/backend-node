import { Router } from 'express';

import PassengerController from '../../controllers/Passenger/passengerController';
import Media from '../../config/media';

import AuthMiddleware from '../../middlewares/auth';

class PassengerApi {
  private readonly router: Router;

  constructor() {
    this.router = Router();
  }

  routes() {
    /**
     * @openapi
     * /api/cars/:
     *  get:
     *     tags:
     *     - CRUD - List All Cars
     *     description: Responds if the app is up and running
     *     responses:
     *       200:
     *         description: App is up and running
     */
    this.router.get('/user/saved-passenger', AuthMiddleware.authorizeUser, PassengerController.listSavedPassenger); // /api/books READ
    
    this.router.get('/user/saved-passenger/:saved_passenger_id', AuthMiddleware.authorizeUser, PassengerController.showSavedPassenger); // /api/books READ

    /**
     * @openapi
     * '/api/cars/':
     *   post:
     *     tags:
     *       - CRUD - Create New Car
     *     summary: Create a new car
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             $ref: '#/components/schema/Car'
     *     responses:
     *       201:
     *         description: Car created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schema/CarResponse'
     *     examples:
     *       carExample:
     *         summary: Example of a car object
     *         value:
     *           plate: IDN-5442
     *           manufacture: Honda
     *           model: Civic
     *           image: ./images/car25.min.jpg
     *           rentPerDay: 1000000
     *           capacity: 2
     *           description: Electric speed-sensitive variable-assist pwr steering. Steel side-door impact beams. Dual bright exhaust tips.
     *           availableAt: 2022-03-23T15:49:05.563Z
     *           transmission: CVT
     *           available: false
     *           type: Wagon
     *           year: 2015
     *           options:
     *             - CD (Single Disc)
     *             - Airbag: Passenger
     *             - A/C: Front
     *             - Power Locks
     *             - Navigation
     *             - Rear Window Defroster
     *             - Rear Window Defroster
     *             - MP3 (Single Disc)
     *             - Airbag: Side
     *           created_by: 1
     *           updated_by: 1
     *           specs:
     *             - Electric speed-sensitive variable-assist pwr steering
     *             - Steel side-door impact beams
     *             - Dual bright exhaust tips
     *             - Remote fuel lid release
     *             - Traveler/mini trip computer
     */

    this.router.post('/', AuthMiddleware.authorizeUser, PassengerController.create);
    /**
     * @openapi
     * '/api/cars/{flight_id}':
     *  get:
     *     tags:
     *     - Cars
     *     summary: Get a single car by the flight_id
     *     parameters:
     *      - name: flight_id
     *        in: path
     *        description: The id of the car
     *        required: true
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *          application/json:
     *           schema:
     *              $ref: '#/components/schema/CarResponse'
     *       404:
     *         description: Product not found
     *  put:
     *     tags:
     *     - Car
     *     summary: Update a single car
     *     parameters:
     *      - name: flight_id
     *        in: path
     *        description: The id of the car
     *        required: true
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             $ref: '#/components/schema/Car'
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *          application/json:
     *           schema:
     *              $ref: '#/components/schema/CarResponse'
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Product not found
     *  delete:
     *     tags:
     *     - Car
     *     summary: Delete a single car
     *     parameters:
     *      - name: flight_id
     *        in: path
     *        description: The id of the car
     *        required: true
     *     responses:
     *       200:
     *         description: Product deleted
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Product not found
     */
    // this.router.get('/:passenger_id', AuthMiddleware.authorizeUser, PassengerController.show); // /api/books/1 -> /api/books/:id READ
    // this.router.put(
    //   '/:passenger_id',
    //   AuthMiddleware.authorizeUser,
    //   PassengerController.update
    // ); // /api/books/1 -> /api/books/:ticket_id UPDATE
    // this.router.delete('/:passenger_id', 
    // AuthMiddleware.authorizeUser, 
    // PassengerController.delete); // /api/books/1 -> /api/books/:id DELETE

    return this.router;
  }
}

export default new PassengerApi();
import { type Request, type Response, Router } from 'express';
import HealthController from '../../controllers/Health/healthController'; // Correct import

class HealthApi {
  private readonly router: Router;

  constructor() {
    this.router = Router();
  }

  routes() {
    /**
     * @openapi
     * /api/cars/healthcheck:
     *  get:
     *     tags:
     *     - Healthcheck
     *     description: Responds if the app is up and running
     *     responses:
     *       200:
     *         description: App is up and running
     */

    this.router.get('/', (req: Request, res: Response) => {
      const result = HealthController.healthCheck(req, res);
      res.json({
        health: result,
        status: 200
      });
    });

    return this.router;
  }
}

export default new HealthApi();

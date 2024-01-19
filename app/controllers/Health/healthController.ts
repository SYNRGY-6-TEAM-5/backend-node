import { type Request, type Response } from 'express';

interface IHealthController {
  healthCheck: (req: Request, res: Response) => void;
  healthCheckSync: () => string;
  healthCheckAsync: () => Promise<string>;
}

class HealthController implements IHealthController {
  constructor() {}

  healthCheck(req: Request, res: Response): void {
    res.sendStatus(200);
  }

  healthCheckSync(): string {
    return 'OK';
  }

  async healthCheckAsync(): Promise<string> {
    return await Promise.resolve('OK');
  }
}

export default new HealthController();

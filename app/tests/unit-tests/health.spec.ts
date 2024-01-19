import chai from 'chai';

import HealthController from '../../controllers/Health/healthController';
const expect = chai.expect; // Use import syntax for TypeScript

describe('Testing server async/sync health', () => {
  describe('Health check on /sync', () => {
    it('health should be okay', () => {
      const actualResult = HealthController.healthCheckSync();
      expect(actualResult).to.equal('OK');
    });
  });

  describe('Health check on /async', () => {
    it('health should be okay', async () => {
      const actualResult = await HealthController.healthCheckAsync();
      expect(actualResult).to.equal('OK');
    });
  });
});

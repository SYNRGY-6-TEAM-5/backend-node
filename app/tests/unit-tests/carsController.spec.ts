import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'
chai.use(sinonChai);

import path from 'path';
import * as fs from 'fs';

import CarsController from '../../controllers/Cars/carsController';
import authController from '../../controllers/Auth/authController';
import CarsService from '../../services/carsService';
import authService from '../../services/authService';
import { mockUserData, mockCarsData, mockCarData, mockCreateCarData, mockCount } from '../data/testData';


describe('Running unit test on cars controllers...', () => {
  let serviceStub: any;
  let authSeviceStub: any;
  let validToken: string;

  before(async () => {

    const loginReq = mockReq({
      body: {
        email: 'adminuser@gmail.com',
        password: 'adminuser'
      }
    });
    const loginRes = mockRes();


    await authController.login(loginReq, loginRes);


    validToken = loginRes.json.getCall(0).args[0].token;
  });

  beforeEach(() => {
    serviceStub = sinon.stub(CarsService);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Testing list()", () => {
    it('should handle list function correctly', async () => {
      const req = mockReq();
      const res = mockRes();

      serviceStub.list.resolves({ data: mockCarsData, count: mockCount });

      await CarsController.list(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        message: 'success showing list of all cars',
        data: mockCarsData,
        meta: {
          page: 1,
          size: 10,
          totalData: mockCount,
          totalPages: 0
        }
      })).to.be.true;
    });
  });

  describe("Testing show()", () => {
    it('should handle show function correctly', async () => {
      const req = mockReq({
        params: {
          car_id: 2
        }
      });
      const res = mockRes();

      serviceStub.get.withArgs(req.params.car_id).resolves(mockCarData);

      await CarsController.show(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        message: 'success showing a car',
        data: mockCarData,
        meta: {
          page: 1,
          size: 10,
          totalData: 1,
          totalPages: 0
        }
      })).to.be.true;
    });
  });

  describe('Testing create()', () => {
    it('should handle create function correctly', async () => {
      const req = mockReq({
        body: {
          userToken: `Bearer ${validToken}`,
        },
      });
      const res = mockRes();


      authSeviceStub = sinon.stub(authService, 'validateToken').resolves(mockUserData);

      serviceStub.create.resolves(mockCreateCarData);

      await CarsController.create(req, res, authSeviceStub);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        message: 'success create a new car',
        data: mockCreateCarData,
        meta: {
          page: 1,
          size: 10,
          totalData: 0,
          totalPages: 0
        }
      })).to.be.true;
    });
  });

  describe('Testing upload()', () => {
    it('should upload a file with authorization token', async () => {
      const filename = 'testImage.png';
      const filePath = path.join(__dirname, '../data', filename);
      const fileBuffer = fs.readFileSync(filePath);

      const req = mockReq({
        file: {
          buffer: fileBuffer,
          mimetype: 'image/png',
        },
        body: {
          userToken: `Bearer ${validToken}`
        }
      });
      const res = mockRes();

      await CarsController.upload(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.getCall(0).args[0].data).to.have.property("url");
    });
  });

  describe('Testing update()', () => {
    it('should handle update function correctly', async () => {
      const req = mockReq({
        params: {
          car_id: 2
        },
        body: {
          userToken: `Bearer ${validToken}`,
        }
      });
      const res = mockRes();

      authSeviceStub = sinon.stub(authService, 'validateToken').resolves(mockUserData);

      serviceStub.update.withArgs(req.params.car_id).resolves(mockCreateCarData);

      await CarsController.update(req, res, authSeviceStub);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({
        message: 'success updating car data',
        data: mockCreateCarData,
        meta: {
          page: 1,
          size: 10,
          totalData: 0,
          totalPages: 0
        }
      })).to.be.true;
    });
  });

  describe('Testing delete()', () => {
    it('should handle delete function correctly', async () => {
      const req = mockReq({
        params: {
          car_id: 2
        },
        headers: {
          authorization: `Bearer ${validToken}`,
        }
      });
      const res = mockRes();

      serviceStub.delete.withArgs(req.params.car_id).resolves();

      await CarsController.delete(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({
        status: 'OK',
        message: 'Successfully deleted car'
      })).to.be.true;
    });
  });

});

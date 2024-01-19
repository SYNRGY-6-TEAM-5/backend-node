import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'
chai.use(sinonChai);

import authController from '../../controllers/Auth/authController';
import authService from '../../services/authService';


describe('Running unit test on auth controllers...', () => {
    let authSeviceStub: any;

    // describe("Testing login()", () => {
    //     it('should handle login function correctly', async () => {
    //         const req = mockReq({
    //             body: {
    //                 email: 'adminuser@gmail.com',
    //                 password: 'adminuser'
    //             }
    //         });
    //         const res = mockRes();

    //         await authController.login(req, res);

    //         expect(res.status.calledWith(200)).to.be.true;
    //         expect(res.json.calledWith({
    //             success: true,
    //             message: 'User logged in successfully',
    //             token: res.json.getCall(0).args[0].token
    //         })).to.be.true;
    //     });
    // });

    describe('Testing register()', () => {
        it('should handle register function correctly', async () => {
            const requestBody = {
                first_name: 'Admin',
                last_name: 'User 2',
                email: 'adminuser2@gmail.com',
                password: 'adminuser2',
                role: 'admin'
            };

            const req = mockReq({ body: requestBody });
            const res = mockRes();

            authSeviceStub = sinon.stub(authService);
            authSeviceStub.register.resolves(requestBody);

            // Call the controller function
            await authController.register(req, res);

            // Assert the response from the controller
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                success: true,
                message: 'User registered successfully',
                user: requestBody
            })).to.be.true;

            sinon.restore();
        });
    });
});
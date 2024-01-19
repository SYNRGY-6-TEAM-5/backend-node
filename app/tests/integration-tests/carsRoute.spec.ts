import * as fs from 'fs';
import * as path from 'path';
import request from 'supertest';
import app from '../../server';

import { mockCreateCarData } from '../data/testData';

describe("Running integration test on cars routes...", () => {
    var token: string;

    before(async () => {

        const loginData = {
            email: 'adminuser@gmail.com',
            password: 'adminuser'
        };


        const loginResponse = await request(app)
            .post('/api/user/login')
            .send(loginData);


        token = loginResponse.body.token;
        // console.log('Obtained Token:', token);
    });

    describe("List cars Route", () => {
        it("it should has status code 200", () => {
            request(app)
                .get("/api/cars/")
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
        });
    });

    describe("Show car Route", () => {
        it("it should has status code 200", () => {
            const car_id = 2;
            request(app)
                .get(`/api/cars/${car_id}`)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
        });
    });

    describe('File Upload Route', () => {
        it('should upload a file with authorization token', () => {
            const filename = 'testImage.png';
            const boundary = Math.random().toString();

            const filePath = path.join(__dirname, '../data', filename);

            const formData = `--${boundary}\r\n` +
                `content-disposition: form-data; name="image"; filename="${filename}"\r\n` +
                'content-type: image/png\r\n' +
                '\r\n' +
                fs.readFileSync(filePath) +
                '\r\n--' + boundary + '--';

            request(app)
                .post('/api/cars/upload')
                .set('Content-Type', `multipart/form-data; boundary=${boundary}`)
                .set('Authorization', `Bearer ${token}`)
                .send(formData)
                .expect(200)
                .end(function (err: any, res: any) {
                    if (err) {
                        console.error(err);
                        return;
                    };
                })
        })
    });

    describe('Create Car Route', () => {
        it('should create a new car with authorization token', async () => {
            const userToken = `Bearer ${token}`; // Replace with a valid user token

            // Make a POST request to create a new car
            request(app)
                .post('/api/cars/create') // Replace with your create route
                .set('Authorization', userToken)
                .send(mockCreateCarData)
                .expect(201);
            // .expect(response.body).to.have.property('success').to.be.true
            // .expect(response.body).to.have.property('message', 'success create a new car');
        });
    });
    
    describe('Update Car Route', () => {
        it('should update a car with authorization token', async () => {
            const userToken = `Bearer ${token}`; // Replace with a valid user token
            const car_id = 2;
            // Make a POST request to create a new car
            request(app)
                .put(`/api/cars/${car_id}`) // Replace with your create route
                .set('Authorization', userToken)
                .send(mockCreateCarData)
                .expect(201);
            // .expect(response.body).to.have.property('success').to.be.true
            // .expect(response.body).to.have.property('message', 'success create a new car');
        });
    });
    
    describe('Delete Car Route', () => {
        it('should delete a car with authorization token', async () => {
            const userToken = `Bearer ${token}`; // Replace with a valid user token
            const car_id = 2;
            // Make a POST request to create a new car
            request(app)
                .delete(`/api/cars/${car_id}`) // Replace with your create route
                .set('Authorization', userToken)
                .expect(201);
            // .expect(response.body).to.have.property('success').to.be.true
            // .expect(response.body).to.have.property('message', 'success create a new car');
        });
    });
});

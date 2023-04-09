import { createServer } from 'src/services/server';

import supertest from 'supertest';
import { API_PREFIX } from 'src/__tests__/test.config';
// import { MongoMemoryServer } from 'mongodb-memory-server';
// import mongoose from 'mongoose';

const app = createServer();

describe('Misc Routes', () => {
  describe('when access /_health', () => {
    it('should return ok', async () => {
      const { text, statusCode } = await supertest(app).get(
        API_PREFIX + '/_health'
      );
      expect(statusCode).toBe(200);
      expect(text).toContain('OK');
    });
  });
  // describe('given the register user with a duplicated email', () => {
  //   it('should remind the user that the email is already in use', async () => {
  //     const testUser: UserInputType = {
  //       ...userInput,
  //       email: faker.internet.email(),
  //     };
  //     await UserModel.create(testUser);
  //     const mailer = jest.spyOn(mailerUtil, 'sendEmail');
  //     const { statusCode, text } = await supertest(app)
  //       .post(API_PREFIX + '/users')
  //       .send(testUser);
  //     expect(statusCode).toBe(409);
  //     expect(text).toContain('account already exists');
  //     expect(mailer).not.toHaveBeenCalled();
  //   });
  // });
  // describe('given a valid user input', () => {
  //   it('should register successfully', async () => {
  //     const mailer = jest.spyOn(mailerUtil, 'sendEmail');
  //     const testUser: UserInputType = {
  //       ...userInput,
  //       email: faker.internet.email(),
  //     };
  //     const { text, statusCode } = await supertest(app)
  //       .post(API_PREFIX + '/users')
  //       .send(testUser);
  //     expect(statusCode).toBe(200);
  //     expect(text).toContain(`User successfully Created with id:`);
  //     expect(mailer).toHaveBeenCalledTimes(1);
  //   });
  // });
});

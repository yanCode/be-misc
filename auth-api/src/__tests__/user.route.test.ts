import { createServer } from 'src/services/server';
import * as UserService from 'src/services/user.service';
import { createUser } from 'src/services/user.service';
import supertest from 'supertest';
import { API_PRFIX, userInput } from 'src/__tests__/test.config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import UserModel from 'src/models/user.model';

type CreateUserOutput = Awaited<ReturnType<typeof createUser>>;

const app = createServer();

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  console.log('connected');
  // await dBConnect();
});
afterAll(async () => {
  await UserModel.collection.drop();
  await mongoose.disconnect();
  console.log('closing');
  await mongoose.connection.close();
});

describe('User Routes', () => {
  describe('User Register', () => {
    describe('given a invalid user input which un-matching confirmed password', () => {
      it('should return error before calling createUser service', async () => {
        const { text, statusCode } = await supertest(app)
          .post(API_PRFIX + '/users')
          .send({ ...userInput, passwordConfirmation: 'incorrect password' });
        expect(statusCode).toBe(400);
        expect(text).toContain('Passwords do not match');
      });
    });
    describe('given the register user with a duplicated email', () => {
      it('should remind the user the email is already in use', async () => {
        const createUserServices = jest
          .spyOn(UserService, 'createUser')
          .mockRejectedValue({ code: 11000 });
        const { statusCode, text } = await supertest(app)
          .post(API_PRFIX + '/users')
          .send(userInput);
        expect(statusCode).toBe(409);
        expect(text).toContain('account already exists');
        expect(createUserServices).toHaveBeenCalled();
      });
    });
    describe('given a valid user input', () => {
      //   it('should register successfully', async () => {
      //     const createUserServices = jest
      //       .spyOn(UserService, 'createUser')
      //       .mockResolvedValue(userOutput as unknown as CreateUserOutput);
      //     const { text, statusCode } = await supertest(app)
      //       .post(API_PRFIX + '/users')
      //       .send(userInput);
      //     expect(statusCode).toBe(200);
      //     expect(text).toContain(
      //       `User successfully Created with id: ${userOutput._id}`
      //     );
      //     expect(createUserServices).toHaveBeenCalledTimes(1);
      //   });
      // });
    });
  });
  describe('User verification', () => {
    describe('given a valid user input', () => {
      // it('should verify successfully', async () => {
      //   const verifyUserServices = jest
      //     .spyOn(UserService, 'findUserById')
      //     .mockResolvedValue(userOutput as unknown as CreateUserOutput);
      //   const { text, statusCode } = await supertest(app).post(
      //     `${API_PRFIX}/users/verify/${userOutput._id}/${userOutput.verificationCode}`
      //   );
      //   expect(statusCode).toBe(200);
      //   expect(text).toContain(
      //     `User successfully Verified with id: ${userOutput._id}`
      //   );
      //   expect(verifyUserServices).toHaveBeenCalledTimes(1);
      // });
    });
  });
});

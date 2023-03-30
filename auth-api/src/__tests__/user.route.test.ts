import { createServer } from 'src/services/server';

import supertest from 'supertest';
import {
  API_PRFIX,
  cleanLogin,
  userInput,
  UserInputType,
  userLogin,
} from 'src/__tests__/test.config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import UserModel from 'src/models/user.model';
import * as mailerUtil from 'src/utils/mailer.utils';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';

const app = createServer();

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe('User Routes', () => {
  describe('User Register', () => {
    describe('given a invalid user input which un-matching confirmed password', () => {
      it('should return error before calling createUser service', async () => {
        const mailer = jest.spyOn(mailerUtil, 'sendEmail');
        const { text, statusCode } = await supertest(app)
          .post(API_PRFIX + '/users')
          .send({ ...userInput, passwordConfirmation: 'different_password' });
        expect(statusCode).toBe(400);
        expect(text).toContain('Passwords do not match');
        expect(mailer).not.toHaveBeenCalled();
      });
    });
    describe('given the register user with a duplicated email', () => {
      it('should remind the user that the email is already in use', async () => {
        const testUser: UserInputType = {
          ...userInput,
          email: faker.internet.email(),
        };
        await UserModel.create(testUser);
        const mailer = jest.spyOn(mailerUtil, 'sendEmail');
        const { statusCode, text } = await supertest(app)
          .post(API_PRFIX + '/users')
          .send(testUser);
        expect(statusCode).toBe(409);
        expect(text).toContain('account already exists');
        expect(mailer).not.toHaveBeenCalled();
      });
    });
    describe('given a valid user input', () => {
      it('should register successfully', async () => {
        const mailer = jest.spyOn(mailerUtil, 'sendEmail');
        const testUser: UserInputType = {
          ...userInput,
          email: faker.internet.email(),
        };
        const { text, statusCode } = await supertest(app)
          .post(API_PRFIX + '/users')
          .send(testUser);
        expect(statusCode).toBe(200);
        expect(text).toContain(`User successfully Created with id:`);
        expect(mailer).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe('User verification', () => {
    describe('given a valid verification input.', () => {
      it('should verify successfully', async () => {
        const testUser: UserInputType = {
          ...userInput,
          email: faker.internet.email(),
        };
        const registeredUser = await UserModel.create(testUser);
        const { text, statusCode } = await supertest(app).post(
          `${API_PRFIX}/users/verify/${registeredUser._id}/${registeredUser.verificationCode}`
        );
        expect(statusCode).toBe(200);
        expect(text).toContain(
          `User successfully verified with id: ${registeredUser._id}`
        );
      });
    });
    describe('given an invalid verification input.', () => {
      it('should fail verifying', async () => {
        const testUser: UserInputType = {
          ...userInput,
          email: faker.internet.email(),
        };
        const registeredUser = await UserModel.create(testUser);
        const mailer = jest.spyOn(mailerUtil, 'sendEmail');
        const { text, statusCode } = await supertest(app).post(
          `${API_PRFIX}/users/verify/${registeredUser._id}/'not_correct_verification_code'`
        );
        expect(statusCode).toBe(400);
        expect(text).toContain(`Could not verify user`);
        expect(mailer).not.toHaveBeenCalled();
      });
    });
    describe('given an verification input for an already verified user', () => {
      it('should complain the user has been verified', async () => {
        const testUser: UserInputType = {
          ...userInput,
          email: faker.internet.email(),
        };
        const registeredUser = await UserModel.create(testUser);
        registeredUser.verified = true;
        await registeredUser.save();
        const mailer = jest.spyOn(mailerUtil, 'sendEmail');
        const { text, statusCode } = await supertest(app).post(
          `${API_PRFIX}/users/verify/${registeredUser._id}/${registeredUser.verificationCode}`
        );
        expect(statusCode).toBe(400);
        expect(text).toContain(`User already verified`);
        expect(mailer).not.toHaveBeenCalled();
      });
    });
  });
  describe('forgot password', () => {
    describe('given a valid email', () => {
      it('should send out an email for reset password', async () => {
        const testUser: UserInputType = {
          ...userInput,
          email: faker.internet.email(),
        };
        const registeredUser = await UserModel.create(testUser);
        registeredUser.verified = true;
        await registeredUser.save();
        const mailer = jest.spyOn(mailerUtil, 'sendEmail');
        const { text, statusCode } = await supertest(app)
          .post(`${API_PRFIX}/users/forgot-password`)
          .send({ email: registeredUser.email });
        expect(statusCode).toBe(200);
        expect(text).toContain(
          `a password reset code will be sent to this email`
        );
        expect(mailer).toHaveBeenCalledTimes(1);
      });
    });
    describe('given an email does not belong to any registered user', () => {
      it('should not send out the reset password email', async () => {
        const testUser: UserInputType = {
          ...userInput,
          email: faker.internet.email(),
        };
        const registeredUser = await UserModel.create(testUser);
        registeredUser.verified = true;
        await registeredUser.save();
        const mailer = jest.spyOn(mailerUtil, 'sendEmail');
        const { statusCode } = await supertest(app)
          .post(`${API_PRFIX}/users/forgot-password`)
          .send({ email: faker.internet.email() });
        expect(statusCode).toBe(200);
        expect(mailer).not.toHaveBeenCalled();
      });
    });
    describe('given an user who has not been verified', () => {
      it('should allow to reset password', async () => {
        const testUser: UserInputType = {
          ...userInput,
          email: faker.internet.email(),
        };
        const registeredUser = await UserModel.create(testUser);
        const mailer = jest.spyOn(mailerUtil, 'sendEmail');
        const { statusCode, text } = await supertest(app)
          .post(`${API_PRFIX}/users/forgot-password`)
          .send({ email: registeredUser.email });
        expect(statusCode).toBe(400);
        expect(text).toContain('please verify it first');
        expect(mailer).not.toHaveBeenCalled();
      });
    });
  });
  describe('Reset password', () => {
    describe('given a valid reset password input', () => {
      it('should reset the password', async () => {
        const testUser: UserInputType = {
          ...userInput,
          email: faker.internet.email(),
        };
        const registeredUser = await UserModel.create(testUser);
        registeredUser.verified = true;
        registeredUser.passwordResetCode = nanoid();
        await registeredUser.save();
        const password = faker.internet.password();
        const resetInfo = {
          password,
          passwordConfirmation: password,
          email: testUser.email,
        };
        const { text, statusCode } = await supertest(app)
          .post(
            `${API_PRFIX}/users/reset-password/${registeredUser._id}/${registeredUser.passwordResetCode}`
          )
          .send(resetInfo);
        expect(statusCode).toBe(200);
        expect(text).toContain('Password successfully reset');
      });
    });
  });
  describe('me', () => {
    describe('given access token is valid', () => {
      it('should return the info of current user', async () => {
        const { accessToken, email, userId } = await userLogin();
        const { text } = await supertest(app)
          .get(`${API_PRFIX}/users/me`)
          .set('Authorization', `Bearer ${accessToken}`);
        expect(JSON.parse(text).email).toBe(email);
        await cleanLogin(userId);
      });
    });
  });
});

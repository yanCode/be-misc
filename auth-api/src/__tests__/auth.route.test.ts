import { createServer } from 'src/services/server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import {
  API_PREFIX,
  cleanLogin,
  userInput,
  UserInputType,
  userLogin,
} from 'src/__tests__/test.config';
import { faker } from '@faker-js/faker';
import UserModel from 'src/models/user.model';
import { SessionModel } from 'src/models/session.model';

const app = createServer();

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe('Auth Routes', () => {
  describe('Login', () => {
    describe('given correct email & password', () => {
      it('should login successfully', async () => {
        const testUser: UserInputType = {
          ...userInput,
          email: faker.internet.email(),
        };
        const registeredUser = await UserModel.create(testUser);
        registeredUser.verified = true;
        await registeredUser.save();
        const { statusCode, text } = await supertest(app)
          .post(API_PREFIX + '/sessions')
          .send({
            email: testUser.email,
            password: testUser.password,
          });
        expect(statusCode).toBe(200);
        expect(text).toContain('accessToken');
      });
    });
    describe('given incorrect email & password', () => {
      it('should complain invalid email or password', async () => {
        const testUser: UserInputType = {
          ...userInput,
          email: faker.internet.email(),
        };
        const registeredUser = await UserModel.create(testUser);
        registeredUser.verified = true;
        await registeredUser.save();
        const { statusCode, text } = await supertest(app)
          .post(API_PREFIX + '/sessions')
          .send({
            email: testUser.email,
            //provide random password
            password: faker.internet.password(),
          });
        expect(statusCode).toBe(400);
        expect(text).toContain('Invalid email or password');
      });
    });
  });
  describe('refresh access token', () => {
    describe('Given the refresh token is correct', () => {
      it('a newly generated accessToken should be returned', async () => {
        const { accessToken, refreshToken, userId } = await userLogin();
        const { statusCode, text } = await supertest(app)
          .post(API_PREFIX + '/sessions/refresh')
          .set('refresh-token', refreshToken);
        expect(statusCode).toBe(200);
        expect(JSON.parse(text).accessToken).not.toBe(accessToken);
        await cleanLogin(userId);
      });
    });

    describe('Given the refresh token is not correct', () => {
      it('an error should return', async () => {
        const { userId } = await userLogin();
        const { statusCode, text } = await supertest(app)
          .post(API_PREFIX + '/sessions/refresh')
          .set('refresh-token', 'invalid-refresh-token');
        expect(statusCode).toBe(400);
        expect(text).toBe('Invalid refresh token');
        await cleanLogin(userId);
      });
    });
  });
  describe('Logout', () => {
    describe('Given the user is logged in', () => {
      it('should logout successfully', async () => {
        const { userId, refreshToken } = await userLogin();
        const { statusCode, text } = await supertest(app)
          .post(API_PREFIX + '/sessions/logout')
          .set('refresh-token', refreshToken);
        expect(statusCode).toBe(200);
        expect(text).toBe('Logout successfully');
        await cleanLogin(userId);
      });
    });
    describe('Given the user has already logged out', () => {
      it('should not log out again.', async () => {
        const { userId } = await userLogin();
        await SessionModel.updateOne(
          { user: userId },
          { $set: { valid: false } }
        );
        const { statusCode, text } = await supertest(app)
          .post(API_PREFIX + '/sessions/logout')
          .set('refresh-token', 'invalid-refresh-token');
        expect(statusCode).toBe(400);
        expect(text).toBe("You aren't logged in.");
        await cleanLogin(userId);
      });
    });
  });
});

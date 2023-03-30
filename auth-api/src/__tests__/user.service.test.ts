import {
  createUser,
  findUserByEmail,
  findUserById,
} from 'src/services/user.service';
import { userInput } from './test.config';
import { omit } from 'lodash';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import UserModel from 'src/models/user.model';

const userMongoInput = omit(userInput, 'passwordConfirmation');

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  // await dBConnect();
});
afterAll(async () => {
  await UserModel.collection.drop();
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe('User Service', () => {
  describe(' createUser method', () => {
    describe('given a valid user input', () => {
      it('should create a user in DB', async () => {
        const user = omit(userInput, 'passwordConfirmation');
        const userOutput = await createUser(user);
        expect(userOutput).toBeDefined();
        expect(userOutput.verified).toBe(false);
        expect(userOutput.verificationCode).not.toBeNull();
      });
    });

    describe('given a user input whose email is duplicated', () => {
      it('should return a duplicated-email error', async () => {
        expect.assertions(2);
        const user = {
          ...userMongoInput,
          email: '2@2g.com',
        };
        const firstUser = await createUser(user);
        expect(firstUser).toBeDefined();
        try {
          await createUser(user);
        } catch (e: any) {
          expect(e.code).toBe(11000);
        }
      });
    });
  });
  describe(' Find methods:', () => {
    let userId: string;
    const email = '3@3g.com';
    beforeAll(async () => {
      const user = { ...userMongoInput, email };
      const userOutput = await createUser(user);
      userId = userOutput._id.toString();
    });
    afterAll(async () => {
      await UserModel.deleteMany({});
    });

    describe('findUserById', () => {
      describe('given a valid user id', () => {
        it('should return this User', async () => {
          const response = await findUserById(userId);
          expect(response).toBeDefined();
          expect(userId).toBe(response?._id.toString());
        });
        it('should validate the password', async () => {
          const response = await findUserById(userId);
          const isPasswordCorrect = await response?.validatePassword(
            userMongoInput.password
          );
          expect(isPasswordCorrect).toBe(true);
        });
      });

      describe('given an invalid user id', () => {
        it('should return null as the User', async () => {
          const invalidUserId = new mongoose.Types.ObjectId();
          const response = await findUserById(invalidUserId.toString());
          expect(response).toBeNull();
        });
      });
    });
    describe(' findUserByEmail method:', () => {
      describe('given an invalid email', () => {
        it('should return null as the user', async () => {
          const response = await findUserByEmail('invalid@email.com');
          expect(response).toBeNull();
        });
      });
      describe('given a valid email', () => {
        it('it should return the user', async () => {
          const userOutput = await findUserByEmail(email);
          expect(userOutput?.email).toEqual(email);
        });
      });
    });
  });
});

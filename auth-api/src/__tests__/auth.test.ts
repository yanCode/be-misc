import supertest from 'supertest';
import { createServer } from 'src/services/server';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createUser } from 'src/services/user.service';

describe('AuthController', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  const app = createServer();
  describe('given the product doesn exist', () => {
    beforeAll(async () => {
      const user = await createUser({
        email: '1@1.com',
        firstName: 'John',
        lastName: 'Doe',
        password: '123456',
      });
      console.log(user);
    });
    it('should return a 404', async () => {
      const res = await supertest(app).get('/api/v1/products/1');
      expect(res.status).toBe(404);
    });
  });
});

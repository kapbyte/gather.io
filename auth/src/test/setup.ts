import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest'
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string>;
    }
  }
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'trappytrap';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// signup helper
global.signup = async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ 
      email: 'hello@test.com', 
      password: 'password' 
    })
    .expect(201);

  const cookie = response.get('set-cookie');

  return cookie;
};

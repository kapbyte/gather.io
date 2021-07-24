import request from 'supertest';
import { app } from '../../app';

it('clears cookie after successful signout.', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ 
      email: 'hello@test.com', 
      password: 'password' 
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({ 
      email: 'hello@test.com', 
      password: 'password' 
    })
    .expect(200);

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(response.get('set-cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
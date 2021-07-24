import request from 'supertest';
import { app } from '../../app';

it('fails when email that does not exist is supplied.', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({ 
      email: 'hello@test.com', 
      password: 'password' 
    })
    .expect(400);
});

// it('fails when incorrect email & password is supplied.', async () => {
//   await request(app)
//     .post('/api/users/signup')
//     .send({ 
//       email: 'hello@test.com', 
//       password: 'password' 
//     })
//     .expect(201);

//   await request(app)
//     .post('/api/users/signin')
//     .send({ 
//       email: 'hello@test.com', 
//       password: 'passing' 
//     })
//     .expect(400);
// });

// it('responds with cookie when given valid credentials', async () => {
//   await request(app)
//     .post('/api/users/signup')
//     .send({ 
//       email: 'hello@test.com', 
//       password: 'password' 
//     })
//     .expect(201);

//   const response = await request(app)
//     .post('/api/users/signin')
//     .send({ 
//       email: 'hello@test.com', 
//       password: 'password' 
//     })
//     .expect(200);

//   expect(response.get('set-cookie')).toBeDefined();
// });
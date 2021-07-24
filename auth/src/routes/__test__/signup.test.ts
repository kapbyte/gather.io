import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup.', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ 
      email: 'hello@test.com', 
      password: 'password' 
    })
    .expect(201);
});

// it('returns a 422 with invalid email.', async () => {
//   return request(app)
//     .post('/api/users/signup')
//     .send({ 
//       email: 'hello', 
//       password: 'password' 
//     })
//     .expect(422)
// });

// it('returns a 422 with invalid password.', async () => {
//   return request(app)
//     .post('/api/users/signup')
//     .send({ 
//       email: 'hello@test.com', 
//       password: 'pa' 
//     })
//     .expect(422)
// });

// it('returns a 422 with missing email and password.', async () => {
//   await request(app)
//     .post('/api/users/signup')
//     .send({ 
//       email: 'hello@test.com'
//     })
//     .expect(422)

//   await request(app)
//     .post('/api/users/signup')
//     .send({ 
//       password: 'password' 
//     })
//     .expect(422)
// });

// it('disallows duplicate emails.', async () => {
//   await request(app)
//     .post('/api/users/signup')
//     .send({ 
//       email: 'hello@test.com', 
//       password: 'password' 
//     })
//     .expect(201);

//   await request(app)
//     .post('/api/users/signup')
//     .send({ 
//       email: 'hello@test.com', 
//       password: 'password' 
//     })
//     .expect(400);
// });

// it('sets cookie after successful signup.', async () => {
//   const response = await request(app)
//     .post('/api/users/signup')
//     .send({ 
//       email: 'hello@test.com', 
//       password: 'password' 
//     })
//     .expect(201);
    
//   expect(response.get('set-cookie')).toBeDefined();
// });

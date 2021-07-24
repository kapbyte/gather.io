import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if ticket is not found.', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
}); 

it('returns ticket if found.', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Jam party',
      price: 10
    })
    .expect(201);
  
  // const ticketResponse = await request(app)
  //   .get(`/api/tickets${response.body._id}`)
  
  // console.log(response.body);
}); 
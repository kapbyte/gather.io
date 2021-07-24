import request from 'supertest';
import { app } from '../../app'; 
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist.', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Pool party',
      price: 10
    })
    .expect(404);
}); 

// it('returns a 401 if the provided id does not exist.', async () => {
//   const id = mongoose.Types.ObjectId().toHexString();
//   await request(app)
//     .put(`/api/tickets/${id}`)
//     .send({
//       title: 'Jam party',
//       price: 10
//     })
//     .expect(401);
// });

// it('returns a 401 if the user does not own the ticket.', async () => {
//   const response = await request(app)
//     .post('/api/tickets')
//     .set('Cookie', global.signin())
//     .send({
//       title: 'Jam party',
//       price: 10
//     });

//   await request(app)
//     .put(`/api/tickets/${response.body._id}`)
//     .set('Cookie', global.signin())
//     .send({
//       title: 'randomparty',
//       price: 100
//     })
//     .expect(401);
// });

// it('returns a 422 if the user provides invalid title or price.', async () => {
//   const cookie = global.signin();

//   const response = await request(app)
//     .post('/api/tickets')
//     .set('Cookie', cookie)
//     .send({
//       title: 'Jam party',
//       price: 10
//     });

//   await request(app)
//     .put(`/api/tickets/${response.body._id}`)
//     .set('Cookie', cookie)
//     .send({
//       title: '',
//       price: 100
//     })
//     .expect(422);

//   await request(app)
//     .put(`/api/tickets/${response.body._id}`)
//     .set('Cookie', cookie)
//     .send({
//       title: 'Jam party',
//       price: -25
//     })
//     .expect(422);
// });

// it('updates ticket when provided valid inputs.', async () => {
//   const cookie = global.signin();

//   const response = await request(app)
//     .post('/api/tickets')
//     .set('Cookie', cookie)
//     .send({
//       title: 'Jam party',
//       price: 15
//     });

//   await request(app)
//     .put(`/api/tickets/${response.body._id}`)
//     .set('Cookie', cookie)
//     .send({
//       title: 'Jam party update',
//       price: 20
//     })
//     .expect(200);

//   const ticketResponse = await request(app)
//     .get(`/api/tickets/${response.body._id}`)
//     .send()

//   expect(ticketResponse.body.title).toEqual('Jam party update');
//   expect(ticketResponse.body.price).toEqual(20);
// });

it('Updates ticket and publishes update event.', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Jam party',
      price: 15
    });

  await request(app)
    .put(`/api/tickets/${response.body._id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Jam party update',
      price: 20
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('Updates ticket and publishes update event.', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Jam party',
      price: 15
    });

  console.log('response => ', response.body);

  const ticket = await Ticket.findById(response.body._id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body._id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Jam party update',
      price: 20
    })
    .expect(400);  
});
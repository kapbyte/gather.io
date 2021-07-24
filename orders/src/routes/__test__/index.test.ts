import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it.todo('fetches orders for an particular user');

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  return ticket;
};

// it('fetches orders for particular user', async () => {
//   // Create three tickets
//   const ticketOne = await buildTicket();
//   const ticketTwo = await buildTicket();
//   const ticketThree = await buildTicket();

//   const userOne = global.signin();
//   const userTwo = global.signin();
//   // Create one order as User #1
//   await request(app)
//     .post('/api/orders')
//     .set('Cookie', userOne)
//     .send({ ticketId: ticketOne._id })
//     .expect(201);

//   // Create two orders as User #2
//   const { body: orderOne } = await request(app)
//     .post('/api/orders')
//     .set('Cookie', userTwo)
//     .send({ ticketId: ticketTwo._id })
//     .expect(201);
//   const { body: orderTwo } = await request(app)
//     .post('/api/orders')
//     .set('Cookie', userTwo)
//     .send({ ticketId: ticketThree._id })
//     .expect(201);

//   console.log(userTwo);

//   // Make request to get orders for User #2
//   const response = await request(app)
//     .get('/api/orders')
//     .set('Cookie', userTwo)
//     .expect(200);

//   // Make sure we only got the orders for User #2
//   expect(response.body.length).toEqual(2);
//   expect(response.body[0]._id).toEqual(orderOne._id);
//   expect(response.body[1]._id).toEqual(orderTwo._id);
//   expect(response.body[0].ticket._id).toEqual(ticketTwo._id);
//   expect(response.body[1].ticket._id).toEqual(ticketThree._id);
// });

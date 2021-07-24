import request from 'supertest';
import { app } from '../../app'; 
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { OrderStatus } from '@kaptickets/common';

it('returns error if ticket does not exist.', async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
}); 

it('returns error if ticket is already reserved.', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Party Jam II',
    price: 10
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: '936k0td72914',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket._id })
    .expect(400);
}); 

it('reserves a ticket.', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Party Jam II',
    price: 10
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket._id })
    .expect(201);
}); 

it.todo('emits order created event.');
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { OrderStatus } from '@kaptickets/common';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket._id })
    .expect(201);

  console.log(order);

  // make a request to cancel the order
  await request(app)
    .put(`/api/orders/${order._id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order._id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emits a order cancelled event');

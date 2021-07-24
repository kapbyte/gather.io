import { Listener, Subjects, ExpirationCompleteEvent, OrderStatus } from '@kaptickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCancelledPublisher } from '../publishers/order-created-publisher';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found.');
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order._id,
      version: order.version,
      ticket: {
        id: order.ticket._id,
        price: order.ticket.price
      }
    });

    msg.ack();
  }
};
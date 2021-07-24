import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from '@kaptickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Mark order as paid
    order.set({ status: OrderStatus.Complete });
    await order.save();

    console.log('payment event recieved and ack');

    msg.ack();
  }
};
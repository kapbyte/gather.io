import { Listener, OrderCreatedEvent, Subjects } from '@kaptickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // Throw error if no ticket
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark ticket as reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // Save ticket and publish event
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket._id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId
    });

    // ack message
    msg.ack();
  }
};
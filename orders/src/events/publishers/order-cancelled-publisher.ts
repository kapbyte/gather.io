import { Publisher, OrderCreatedEvent, Subjects } from '@kaptickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
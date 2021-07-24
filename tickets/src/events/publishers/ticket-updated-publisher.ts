import { Publisher, Subjects, TicketUpdatedEvent } from '@kaptickets/common';

export class TicketUpdatedPublisher extends Publisher <TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
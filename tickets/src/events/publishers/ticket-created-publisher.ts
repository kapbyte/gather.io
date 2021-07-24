import { Publisher, Subjects, TicketCreatedEvent } from '@kaptickets/common';

export class TicketCreatedPublisher extends Publisher <TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
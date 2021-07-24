import { Subjects, Publisher, PaymentCreatedEvent } from '@kaptickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
};
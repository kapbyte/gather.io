import { Subjects, Publisher, ExpirationCompleteEvent } from '@kaptickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
};
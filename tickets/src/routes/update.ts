import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { 
  requireAuth, 
  validateRequest, 
  NotFoundError, 
  NotAuthorizedError, 
  BadRequestError
} from '@kaptickets/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id', 
[
  body('title').not().isEmpty().withMessage('Title is required.'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero(0).')
],
validateRequest,
requireAuth, 
async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  if (ticket.orderId) {
    throw new BadRequestError('Cannot edit a reserved ticket.');
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError(); 
  }

  const { title, price } = req.body;
  ticket.set({ title, price });

  await ticket.save();
  await new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket._id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version
  });

  res.send(ticket);
});

export { router as updateTicketRouter };
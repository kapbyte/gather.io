import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@kaptickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post('/api/orders', requireAuth, 
[ 
  body('ticketId').not().isEmpty().withMessage('TicketId must be provided.') 
], 
validateRequest, 
async (req: Request, res: Response) => {
  const { ticketId } = req.body;

  // Find ticket user is trying to order in DB
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  // Make sure ticket is not already reserved
  // Run query to look at all orders. Find an order where the ticket is one we just found above
  // *and* the orders status is *not* cancelled.
  // If we find an order that means ticket *us* reserved.
  const isReservedOrder = await Order.findOne({
    ticket: ticket,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });
  
  if (isReservedOrder) {
    throw new BadRequestError('Ticket already reserved.');
  }

  // Calculate expiration date for this order
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  // Build order and save to DB
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket: ticket
  });
  await order.save();

  // Publish event that order was created
  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order._id,
    version: order.version,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket._id,
      price: ticket.price
    }
  });
  
  res.status(201).send(order);
});

export { router as newOrderRouter };
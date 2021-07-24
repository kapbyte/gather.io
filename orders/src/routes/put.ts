import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@kaptickets/common';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  
  order.status = OrderStatus.Cancelled;
  await order.save();

  // Publish cancel event
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order._id,
    version: order.version,
    ticket: {
      id: order.ticket._id,
      price: 200
    }
  });

  res.send(order);
});

export { router as putOrderRouter };
import express, { Request, Response } from 'express';
import { stripe } from '../stripe';
import { body } from 'express-validator';
import { 
  BadRequestError, 
  NotAuthorizedError, 
  NotFoundError, 
  OrderStatus, 
  requireAuth, 
  validateRequest 
} from '@kaptickets/common';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/payments', requireAuth,
[ body('token').not().isEmpty(), body('orderId').not().isEmpty() ],
validateRequest,
async (req: Request, res: Response) => {
  const { token, orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError('Cannot pay for a cancelled ticket.');
  }

  const charge = await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token,
    description: 'Card Payment Tickety'
  });

  const payment = Payment.build({
    orderId,
    stripeId: charge.id
  });
  await payment.save();

  console.log('payment => ', payment);

  await new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment._id,
    orderId: payment.orderId,
    stripeId: payment.stripeId
  });

  res.status(201).send(charge);
});

export { router as createChargeRouter };
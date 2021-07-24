import express, { Request, Response } from 'express';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { PasswordManager } from '../helpers/password-manager';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@kaptickets/common';

const router = express.Router();

router.post('/api/users/signin', 
[ 
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('Enter your password'),
], 
validateRequest,
async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError('Invalid login credentials');
  }

  const passwordMatch = await PasswordManager.compare(existingUser.password, password);
  if (!passwordMatch) {
    throw new BadRequestError('Invalid login credentials.');
  }

  // Generate JWT
  const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  }, process.env.JWT_KEY!);

  // Store it on session object
  req.session = {
    jwt: userJwt
  }

  res.status(200).json({ id: existingUser._id, email: existingUser.email });
});

export { router as signinRouter };
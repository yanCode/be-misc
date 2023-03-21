import { Request, Response } from 'express';
import { CreateUserInput } from '../schema/user.schema';
import { createUser } from '../services/user.service';
import { sendEmail } from '../utils/mailer';

export async function createUserHandler(
  req: Request<unknown, unknown, CreateUserInput>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    await sendEmail({
      from: 'dev@shengyan.dev',
      to: user.email,
      subject: 'Please verify your account',
      text: `verification code ${user.verificationCode}`,
    });
    return res.send(`User successfully Created with id: ${user._id}`);
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).send('account already exists');
    }
    res.status(500).send(e);
  }
}

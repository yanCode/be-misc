import { Request, Response } from 'express';
import { CreateUserInput, VerifyUserInput } from '../schema/user.schema';
import { createUser, findUserById } from '../services/user.service';
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

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const v = req.params.verificationCode;
  //find the user by id
  const user = await findUserById(id);
  if (!user) {
    return res.status(400).send('Could not verify user');
  }
  if (user.verified) {
    return res.status(400).send('User already verified');
  }
  if (user.verificationCode === v) {
    user.verified = true;
    await user.save();
    return res.send(`User successfully verified with id: ${user._id}`);
  }
  return res.status(400).send('Could not verify user');
}

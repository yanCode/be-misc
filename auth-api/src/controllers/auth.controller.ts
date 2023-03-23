import { findUserByEmail } from '../services/user.service';
import { Request, Response } from 'express';
import {
  CreateSessionInput,
  VAGUE_CREATE_SESSION_FAILED_MESSAGE,
} from '../schema/auth.schema';
import { signAccessToken, signRefreshToken } from '../services/auth.service';

export async function createSessionHandler(
  req: Request<unknown, unknown, CreateSessionInput>,
  res: Response
) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(400).send(VAGUE_CREATE_SESSION_FAILED_MESSAGE);
  }
  if (!user.verified) {
    return res.status(400).send('Please verify your email first');
  }
  const isValid = await user.validatePassword(password);
  if (!isValid) {
    return res.status(400).send(VAGUE_CREATE_SESSION_FAILED_MESSAGE);
  }

  const accessToken = signAccessToken(user);
  const refreshToken = await signRefreshToken({ userId: user._id.toString() });
  return res.send({ accessToken, refreshToken });
}

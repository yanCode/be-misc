import { findUserByEmail, findUserById } from 'src/services/user.service';
import { Request, Response } from 'express';
import {
  CreateSessionInput,
  VAGUE_CREATE_SESSION_FAILED_MESSAGE,
} from 'src/schema/auth.schema';

import { get } from 'lodash';
import { verifyJwt } from 'src/utils/jwt.utils';
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from 'src/services/auth.service';

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

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const refreshToken = get(req, 'headers.refresh-token') as string;
  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    'refreshTokenPublicKey'
  );
  if (!decoded) {
    return res.status(400).send('Invalid refresh token');
  }
  const session = await findSessionById(decoded.session);
  if (!session || !session.valid) {
    return res.status(400).send('Invalid refresh token');
  }
  const user = await findUserById(String(session.user));
  if (!user) {
    return res.status(400).send('Invalid refresh token');
  }
  const accessToken = signAccessToken(user);
  return res.status(200).send({ accessToken });
}

export async function logoutHandler(req: Request, res: Response) {
  const error_message = "You aren't logged in.";
  const refreshToken = get(req, 'headers.refresh-token') as string;
  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    'refreshTokenPublicKey'
  );
  if (!decoded) {
    return res.status(400).send(error_message);
  }
  const session = await findSessionById(decoded.session);
  if (!session || !session.valid) {
    return res.status(400).send(error_message);
  }
  session.valid = false;
  await session.save();
  return res.send('Logout successfully');
}

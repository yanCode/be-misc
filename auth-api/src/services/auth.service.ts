import { DocumentType } from '@typegoose/typegoose';
import { privateFields, User } from '../models/user.model';
import { signJwt } from '../utils/jwt';
import { SessionModel } from '../models/session.model';
import { omit } from 'lodash';

export async function createSession({ userId }: { userId: string }) {
  return await SessionModel.create({ user: userId });
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), privateFields);
  return signJwt(payload, 'accessTokenPrivateKey', {
    expiresIn: '7d',
  });
}

export async function signRefreshToken({ userId }: { userId: string }) {
  const session = await createSession({ userId });
  return signJwt({ session: session._id }, 'refreshTokenPrivateKey', {
    expiresIn: '1m',
  });
}

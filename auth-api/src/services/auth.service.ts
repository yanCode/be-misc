import { DocumentType } from '@typegoose/typegoose';
import { privateFields, User } from 'src/models/user.model';
import { signJwt } from 'src/utils/jwt';
import { SessionModel } from 'src/models/session.model';
import { omit } from 'lodash';

export function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ user: userId });
}

export function findSessionByUserId(userId: string) {
  return SessionModel.findOne({ user: userId });
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), privateFields);
  return signJwt(payload, 'accessTokenPrivateKey', {
    expiresIn: '24h',
  });
}

export async function signRefreshToken({ userId }: { userId: string }) {
  let session = await findSessionByUserId(userId);
  if (session) {
    session.valid = true;
    await session.save();
  } else {
    session = await createSession({ userId });
  }
  return signJwt({ session: session._id }, 'refreshTokenPrivateKey', {
    expiresIn: '1w',
  });
}

export function findSessionById(id: string) {
  return SessionModel.findById(id);
}

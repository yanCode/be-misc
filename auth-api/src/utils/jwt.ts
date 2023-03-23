import jwt from 'jsonwebtoken';
import config from 'config';

export function signJwt(
  // eslint-disable-next-line @typescript-eslint/ban-types
  object: Object,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: jwt.SignOptions | undefined
) {
  const signingKey = Buffer.from(
    config.get<string>(keyName),
    'base64'
  ).toString('ascii');
  return jwt.sign(object, signingKey, {
    ...options,
    algorithm: 'RS256',
  });
}

export function verifyJwt<T>(
  token: string,
  keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
): T | null {
  const verifyingKey = Buffer.from(
    config.get<string>(keyName),
    'base64'
  ).toString('ascii');
  try {
    return jwt.verify(token, verifyingKey) as T;
  } catch (e) {
    return null;
  }
}

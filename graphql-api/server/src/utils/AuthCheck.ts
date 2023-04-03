import { AuthChecker } from 'type-graphql';
import { Context } from './createServer';

export const authCheck: AuthChecker<Context> = async ({ context: { user } }) => {
  return !!user;
};
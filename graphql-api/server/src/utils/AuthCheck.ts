import { AuthChecker } from 'type-graphql';
import { MyContext } from './createServer';

export const authCheck: AuthChecker<MyContext> = async ({ context: { user } }) => {
  return !!user;
};
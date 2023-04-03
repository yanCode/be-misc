import { buildSchema } from 'type-graphql';
import UserResolver from '../user/user.resolver';
import { ApolloServer } from '@apollo/server';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { ApolloFastifyContextFunction, fastifyApolloDrainPlugin } from '@as-integrations/fastify';
import { User } from '../user/user.dto';
import { authCheck } from './AuthCheck';

const fastify = Fastify({ logger: false });

export interface MyContext {
  request: FastifyRequest;
  reply: FastifyReply;
  user?: CtxUser;
}

type CtxUser = Omit<User, 'password'>;

export async function createServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    authChecker: authCheck
  });

  const contextFunction: ApolloFastifyContextFunction<MyContext> = async (
    request,
    reply,
  ) => {
    let user: CtxUser | undefined = undefined;
    try {
      user = await fastify.jwt.verify<CtxUser>(
        request.headers?.authorization || '',
      );
    } catch (e) {
      return {
        request,
        reply,
        user,
      };
    }

    try {
      const user = await request.jwtVerify<CtxUser>();
      return {
        request,
        reply,
        user,
      };
    } catch (e) {
      return {
        request,
        reply,
        user: undefined,
      };
    }
  };

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [fastifyApolloDrainPlugin(fastify)],
  });

  return { fastify, server, contextFunction };
}

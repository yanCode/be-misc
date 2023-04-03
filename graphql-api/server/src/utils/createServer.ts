import { buildSchema } from 'type-graphql';
import UserResolver from '../user/user.resolver';
import { ApolloServer } from '@apollo/server';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import {
  ApolloFastifyContextFunction,
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';
import { User } from '../user/user.dto';

const fastify = Fastify({ logger: false });

export interface MyContext {
  request: FastifyRequest;
  reply: FastifyReply;
  user?: User;
}

export async function createServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const contextFunction: ApolloFastifyContextFunction<MyContext> = async (
    request,
    reply
  ) => {
    let user: User | undefined = undefined;
    try {
      user = await fastify.jwt.verify<User>(
        request.headers?.authorization || ''
      );
    } catch (e) {}
    return {
      request,
      reply,
      user,
    };
  };

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [fastifyApolloDrainPlugin(fastify)],
  });

  return { fastify, server, contextFunction };
}

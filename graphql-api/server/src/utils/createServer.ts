import { buildSchema } from 'type-graphql';
import UserResolver from '../user/user.resolver';
import { ApolloServer } from '@apollo/server';
import Fastify from 'fastify';
import {
  ApolloFastifyContextFunction,
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';

const fastify = Fastify({ logger: false });

interface MyContext {
  token?: String;
}

export async function createServer() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const contextFunction: ApolloFastifyContextFunction<MyContext> = async () => {
    return {
      token: '123',
    };
  };

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [fastifyApolloDrainPlugin(fastify)],
  });

  return { fastify, server, contextFunction };
}

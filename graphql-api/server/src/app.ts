import 'reflect-metadata';
import { createServer } from './utils/createServer';
import fastifyApollo from '@as-integrations/fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';

async function main() {
  const { fastify, contextFunction, server } = await createServer();
  fastify.register(fastifyCors, {
    origin: '*',
    credentials: true,
  });
  fastify.register(fastifyCookie, { parseOptions: {} });
  fastify.register(fastifyJwt, {
    secret: 'secret',
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  });
  fastify.get('/_healthcheck', async (req, res) => {
    res.send('OK');
  });

  await server.start();
  fastify.register(fastifyApollo(server), { context: contextFunction });
  await fastify.listen({
    port: 4000,
  });
  console.log(`🚀 Server ready at http://localhost:4000${server}`);
}

main();

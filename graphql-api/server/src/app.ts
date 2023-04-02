import 'reflect-metadata';
import { createServer } from './utils/createServer';
import fastifyApollo from '@as-integrations/fastify';

async function main() {
  const { fastify, contextFunction, server } = await createServer();
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

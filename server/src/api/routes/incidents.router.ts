import { FastifyInstance } from 'fastify';

export async function incidentsRouter(fastify: FastifyInstance) {
  fastify.get('/', async (_request, reply) => {
    return reply.send({ data: [] });
  });
}

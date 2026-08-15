import { FastifyInstance } from 'fastify';

export async function logsRouter(fastify: FastifyInstance) {
  fastify.get('/', async (_request, reply) => {
    return reply.send({ data: [], meta: { page: 1, limit: 50 } });
  });
}

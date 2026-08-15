import { FastifyInstance } from 'fastify';
import { renderStatusPage } from '../../modules/status-pages/index.js';

export async function statusPagesRouter(fastify: FastifyInstance) {
  fastify.get('/', async (_request, reply) => {
    const html = await renderStatusPage('System Status');
    return reply.type('text/html').send(html);
  });
}

import { FastifyInstance } from 'fastify';
import { UptimeController } from '../../modules/uptime/index.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export async function monitorsRouter(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authMiddleware);

  const controller = new UptimeController();

  fastify.get('/', controller.getMonitors);
  fastify.post('/', controller.createMonitor);
}

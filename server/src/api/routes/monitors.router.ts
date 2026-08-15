import { FastifyInstance } from 'fastify';
import { addMonitor, listTeamMonitors, createMonitorSchema } from '../../modules/uptime/index.js';

export async function monitorsRouter(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    const teamId = (request as any).teamId || '00000000-0000-0000-0000-000000000001';
    const monitors = await listTeamMonitors(teamId);
    return reply.send({ data: monitors });
  });

  fastify.post('/', async (request, reply) => {
    const body = createMonitorSchema.parse(request.body);
    const teamId = (request as any).teamId || '00000000-0000-0000-0000-000000000001';
    const monitor = await addMonitor({ ...body, teamId });
    return reply.status(201).send({ data: monitor });
  });
}

import { FastifyRequest, FastifyReply } from 'fastify';
import { UptimeService } from './service.js';
import { createMonitorSchema } from './schemas.js';
import { AppError } from '../../../shared/errors/app-error.js';

export class UptimeController {
  constructor(private readonly uptimeService: UptimeService = new UptimeService()) {}

  getMonitors = async (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> => {
    const organisationId =
      (request as any).organisationId || (request as any).user?.organisationId;

    if (!organisationId) {
      throw new AppError('Authentication context missing organisation identity.', 401);
    }

    const monitors = await this.uptimeService.getMonitorsByOrganisation(organisationId);
    return reply.status(200).send({ data: monitors });
  };

  createMonitor = async (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> => {
    const parseResult = createMonitorSchema.safeParse(request.body);
    if (!parseResult.success) {
      const issueMessage = parseResult.error.issues.map((i) => i.message).join(', ');
      throw new AppError(`Validation error: ${issueMessage}`, 400);
    }

    const organisationId =
      (request as any).organisationId || (request as any).user?.organisationId;

    if (!organisationId) {
      throw new AppError('Authentication context missing organisation identity.', 401);
    }

    const monitor = await this.uptimeService.createMonitor({
      ...parseResult.data,
      organisationId,
    });

    return reply.status(201).send({ data: monitor });
  };
}

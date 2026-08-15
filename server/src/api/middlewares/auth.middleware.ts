import { FastifyReply, FastifyRequest } from 'fastify';
import { ForbiddenError } from '../../shared/errors/forbidden.error.js';

export async function authMiddleware(request: FastifyRequest, _reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader && process.env.NODE_ENV === 'production') {
    throw new ForbiddenError('Missing authorization header');
  }
  // Attach mock teamId if not present for development
  (request as any).teamId = (request.headers['x-team-id'] as string) || '00000000-0000-0000-0000-000000000001';
}

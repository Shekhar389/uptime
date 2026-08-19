import { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../shared/errors/app-error.js';
import { env } from '../../config/env.js';
import { verifyJwt } from '../../modules/auth/index.js';

export async function authMiddleware(request: FastifyRequest, _reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Missing or malformed authorization header', 401);
  }

  const token = authHeader.substring(7);
  const payload = verifyJwt(token, env.JWT_SECRET);

  if (!payload || !payload.userId || !payload.organisationId) {
    throw new AppError('Invalid or expired authentication token', 401);
  }

  (request as any).user = {
    id: payload.userId as string,
    organisationId: payload.organisationId as string,
  };
  (request as any).organisationId = payload.organisationId as string;
  (request as any).teamId = payload.organisationId as string;
}

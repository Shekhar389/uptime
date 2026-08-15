import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../shared/errors/app-error.js';
import { logger } from '../../infrastructure/logger/index.js';

export function errorHandler(error: FastifyError | AppError, request: FastifyRequest, reply: FastifyReply) {
  const statusCode = 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : 500;
  
  if (statusCode >= 500) {
    logger.error({ err: error, reqId: request.id }, 'Unhandled Server Error');
  } else {
    logger.warn({ err: error, reqId: request.id }, 'Client Error');
  }

  reply.status(statusCode).send({
    error: error.message || 'Internal Server Error',
    statusCode,
    timestamp: new Date().toISOString(),
  });
}

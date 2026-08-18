import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { env } from '../config/env.js';
import { logger } from '../infrastructure/logger/index.js';
import { checkPostgresHealth } from '../infrastructure/db/postgres/client.js';
import { checkClickHouseHealth } from '../infrastructure/db/clickhouse/client.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { authRouter } from './routes/auth.router.js';
import { monitorsRouter } from './routes/monitors.router.js';
import { incidentsRouter } from './routes/incidents.router.js';
import { statusPagesRouter } from './routes/status-pages.router.js';
import { logsRouter } from './routes/logs.router.js';

export async function buildServer() {
  const app = Fastify({
    loggerInstance: logger,
    disableRequestLogging: false,
  });

  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  await app.register(cors, { origin: true });
  await app.register(sensible);

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Uptime Platform API Documentation',
        description: 'Swagger / OpenAPI specification for authentication, user management, monitoring, and telemetry.',
        version: '1.0.0',
      },
      servers: [{ url: `http://localhost:${env.PORT}` }],
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });

  app.setErrorHandler(errorHandler);

  // Health check endpoint
  app.get('/health', async (_request, reply) => {
    const postgresOk = await checkPostgresHealth();
    const clickhouseOk = await checkClickHouseHealth();

    const status = postgresOk && clickhouseOk ? 'ok' : 'degraded';
    const code = status === 'ok' ? 200 : 503;

    return reply.status(code).send({
      status,
      services: {
        postgres: postgresOk ? 'healthy' : 'unhealthy',
        clickhouse: clickhouseOk ? 'healthy' : 'unhealthy',
      },
      timestamp: new Date().toISOString(),
    });
  });

  // Register API routes
  await app.register(authRouter, { prefix: '/api/v1/auth' });
  await app.register(monitorsRouter, { prefix: '/api/v1/monitors' });
  await app.register(incidentsRouter, { prefix: '/api/v1/incidents' });
  await app.register(statusPagesRouter, { prefix: '/api/v1/status-pages' });
  await app.register(logsRouter, { prefix: '/api/v1/logs' });

  return app;
}

async function start() {
  try {
    const app = await buildServer();
    await app.listen({ port: env.PORT, host: env.HOST });
    logger.info(`🚀 Fastify Server listening on http://${env.HOST}:${env.PORT}`);
    logger.info(`📚 Swagger API Docs available at http://${env.HOST}:${env.PORT}/docs`);

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Gracefully closing Fastify server...`);
      await app.close();
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

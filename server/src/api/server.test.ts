import { buildServer } from './server';
import * as postgresClient from '../infrastructure/db/postgres/client';
import * as clickhouseClient from '../infrastructure/db/clickhouse/client';

describe('Fastify Server Harness', () => {
  it('GET /health returns health status when services are ok', async () => {
    jest.spyOn(postgresClient, 'checkPostgresHealth').mockResolvedValue(true);
    jest.spyOn(clickhouseClient, 'checkClickHouseHealth').mockResolvedValue(true);

    const app = await buildServer();
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.status).toBe('ok');
    expect(body.services.postgres).toBe('healthy');
    expect(body.services.clickhouse).toBe('healthy');
    await app.close();
  });

  it('GET /health returns degraded status when services are down', async () => {
    jest.spyOn(postgresClient, 'checkPostgresHealth').mockResolvedValue(false);
    jest.spyOn(clickhouseClient, 'checkClickHouseHealth').mockResolvedValue(false);

    const app = await buildServer();
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(503);
    const body = JSON.parse(response.payload);
    expect(body.status).toBe('degraded');
    expect(body.services.postgres).toBe('unhealthy');
    expect(body.services.clickhouse).toBe('unhealthy');
    await app.close();
  });
});

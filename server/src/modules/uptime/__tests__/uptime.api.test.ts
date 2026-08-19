import { buildServer } from '../../../api/server.js';
import { signJwt } from '../../auth/index.js';
import { env } from '../../../config/env.js';
import { db } from '../../../infrastructure/db/postgres/client.js';

describe('Monitors API (/api/v1/monitors)', () => {
  let app: any;
  let validToken: string;
  let testOrgId: string;

  beforeAll(async () => {
    app = await buildServer();

    // Create a dummy organisation for API integration test
    const testOrg = await db.organisation.create({
      data: {
        name: 'Test Uptime Org',
        status: 'active',
      },
    });
    testOrgId = testOrg.id;

    validToken = signJwt(
      { userId: '00000000-0000-0000-0000-000000000001', organisationId: testOrgId },
      env.JWT_SECRET
    );
  });

  afterAll(async () => {
    // Clean up created monitors and organisation
    if (testOrgId) {
      await db.monitor.deleteMany({ where: { organisationId: testOrgId } });
      await db.organisation.delete({ where: { id: testOrgId } });
    }
    await app.close();
  });

  describe('Authentication Enforcement', () => {
    it('GET /api/v1/monitors should return 401 when Authorization header is missing', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/monitors',
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.payload);
      expect(body.error).toContain('Missing or malformed authorization header');
    });

    it('POST /api/v1/monitors should return 401 when Authorization header is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/monitors',
        payload: {
          name: 'Unauth Monitor',
          url: 'https://example.com',
        },
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.payload);
      expect(body.error).toContain('Missing or malformed authorization header');
    });
  });

  describe('POST /api/v1/monitors', () => {
    it('should return 400 when interval is less than 180 seconds (3 minutes)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/monitors',
        headers: {
          authorization: `Bearer ${validToken}`,
        },
        payload: {
          name: 'Short Interval Monitor',
          url: 'https://example.com',
          intervalSeconds: 60, // Invalid (less than 180s minimum)
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.payload);
      expect(body.error).toContain('Minimum interval allowed is 180 seconds');
    });

    it('should return 400 when type is invalid (e.g. grpc when only http is allowed)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/monitors',
        headers: {
          authorization: `Bearer ${validToken}`,
        },
        payload: {
          name: 'GRPC Monitor',
          url: 'https://example.com',
          type: 'grpc', // Invalid for now
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.payload);
      expect(body.error).toContain('Validation error');
    });

    it('should successfully create a monitor with default interval 300s and type http', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/v1/monitors',
        headers: {
          authorization: `Bearer ${validToken}`,
        },
        payload: {
          name: 'API Health Checker',
          url: 'https://api.example.com/health',
          status: 'down', // Should be ignored by schema/backend
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.payload);
      expect(body.data).toBeDefined();
      expect(body.data.name).toBe('API Health Checker');
      expect(body.data.url).toBe('https://api.example.com/health');
      expect(body.data.type).toBe('http');
      expect(body.data.intervalSeconds).toBe(300);
      expect(body.data.status).toBe('up'); // status set by backend default, ignoring payload 'down'
      expect(body.data.organisationId).toBe(testOrgId);
    });
  });

  describe('GET /api/v1/monitors', () => {
    it('should list all monitors for the authenticated user organisation', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/monitors',
        headers: {
          authorization: `Bearer ${validToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThanOrEqual(1);
      expect(body.data[0].organisationId).toBe(testOrgId);
    });
  });
});

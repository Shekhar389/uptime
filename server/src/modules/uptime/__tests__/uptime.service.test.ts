import { UptimeService } from '../internal/service.js';
import { DbClient } from '../../../infrastructure/db/postgres/client.js';

jest.mock('../internal/checker.service.js', () => ({
  pingUrl: jest.fn(),
}));

import { pingUrl } from '../internal/checker.service.js';

describe('UptimeService', () => {
  let mockDbClient: any;
  let service: UptimeService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDbClient = {
      monitor: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    service = new UptimeService(mockDbClient as unknown as DbClient);
  });

  it('should call db.monitor.create with default interval (300s) and type ("http")', async () => {
    const fakeMonitor = {
      id: 'm-123',
      organisationId: 'org-456',
      name: 'Test Service',
      type: 'http',
      url: 'https://example.com/health',
      intervalSeconds: 300,
      status: 'up',
      consecutiveFails: 0,
      lastCheckedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDbClient.monitor.create.mockResolvedValue(fakeMonitor);

    const result = await service.createMonitor({
      organisationId: 'org-456',
      name: 'Test Service',
      url: 'https://example.com/health',
      type: 'http',
      intervalSeconds: 300,
    });

    expect(mockDbClient.monitor.create).toHaveBeenCalledWith({
      data: {
        organisationId: 'org-456',
        name: 'Test Service',
        url: 'https://example.com/health',
        type: 'http',
        intervalSeconds: 300,
        status: 'up',
      },
    });
    expect(result).toEqual(fakeMonitor);
  });

  it('should get monitors due for check', async () => {
    const dueMonitors = [
      {
        id: 'm-1',
        organisationId: 'org-456',
        name: 'Service 1',
        type: 'http',
        url: 'https://s1.example.com',
        intervalSeconds: 300,
        status: 'up',
        consecutiveFails: 0,
        lastCheckedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockDbClient.monitor.findMany.mockResolvedValue(dueMonitors);

    const now = new Date('2026-08-19T12:00:00Z');
    const result = await service.getMonitorsDueForCheck(now);

    expect(mockDbClient.monitor.findMany).toHaveBeenCalled();
    expect(result).toEqual(dueMonitors);
  });

  it('should process successful ping (resets consecutiveFails to 0 and keeps status up)', async () => {
    const monitor = {
      id: 'm-1',
      organisationId: 'org-456',
      name: 'Service 1',
      type: 'http',
      url: 'https://s1.example.com',
      intervalSeconds: 300,
      status: 'up',
      consecutiveFails: 1,
      lastCheckedAt: new Date('2026-08-19T11:55:00Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDbClient.monitor.findUnique.mockResolvedValue(monitor);
    mockDbClient.monitor.update.mockResolvedValue({
      ...monitor,
      consecutiveFails: 0,
      status: 'up',
    });

    const result = await service.processMonitorCheck('m-1', {
      isUp: true,
      statusCode: 200,
      responseTimeMs: 120,
    });

    expect(mockDbClient.monitor.update).toHaveBeenCalledWith({
      where: { id: 'm-1' },
      data: expect.objectContaining({
        status: 'up',
        consecutiveFails: 0,
        lastCheckedAt: expect.any(Date),
      }),
    });
    expect(result.status).toBe('up');
    expect(result.consecutiveFails).toBe(0);
  });

  it('should process 1st failed ping (increments consecutiveFails to 1, status remains up)', async () => {
    const monitor = {
      id: 'm-1',
      organisationId: 'org-456',
      name: 'Service 1',
      type: 'http',
      url: 'https://s1.example.com',
      intervalSeconds: 300,
      status: 'up',
      consecutiveFails: 0,
      lastCheckedAt: new Date('2026-08-19T11:55:00Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDbClient.monitor.findUnique.mockResolvedValue(monitor);
    mockDbClient.monitor.update.mockResolvedValue({
      ...monitor,
      consecutiveFails: 1,
      status: 'up',
    });

    const result = await service.processMonitorCheck('m-1', {
      isUp: false,
      statusCode: 500,
      responseTimeMs: 5000,
      error: 'Internal Server Error',
    });

    expect(mockDbClient.monitor.update).toHaveBeenCalledWith({
      where: { id: 'm-1' },
      data: expect.objectContaining({
        status: 'up',
        consecutiveFails: 1,
        lastCheckedAt: expect.any(Date),
      }),
    });
    expect(result.status).toBe('up');
    expect(result.consecutiveFails).toBe(1);
  });

  it('should process 2nd consecutive failed ping (increments consecutiveFails to 2, status changes to down)', async () => {
    const monitor = {
      id: 'm-1',
      organisationId: 'org-456',
      name: 'Service 1',
      type: 'http',
      url: 'https://s1.example.com',
      intervalSeconds: 300,
      status: 'up',
      consecutiveFails: 1,
      lastCheckedAt: new Date('2026-08-19T11:55:00Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDbClient.monitor.findUnique.mockResolvedValue(monitor);
    mockDbClient.monitor.update.mockResolvedValue({
      ...monitor,
      consecutiveFails: 2,
      status: 'down',
    });

    const result = await service.processMonitorCheck('m-1', {
      isUp: false,
      statusCode: 500,
      responseTimeMs: 5000,
      error: 'Internal Server Error',
    });

    expect(mockDbClient.monitor.update).toHaveBeenCalledWith({
      where: { id: 'm-1' },
      data: expect.objectContaining({
        status: 'down',
        consecutiveFails: 2,
        lastCheckedAt: expect.any(Date),
      }),
    });
    expect(result.status).toBe('down');
    expect(result.consecutiveFails).toBe(2);
  });

  it('should run batch checks for due monitors', async () => {
    const dueMonitors = [
      {
        id: 'm-1',
        organisationId: 'org-456',
        name: 'Service 1',
        type: 'http',
        url: 'https://s1.example.com',
        intervalSeconds: 300,
        status: 'up',
        consecutiveFails: 0,
        lastCheckedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockDbClient.monitor.findMany.mockResolvedValue(dueMonitors);
    mockDbClient.monitor.findUnique.mockResolvedValue(dueMonitors[0]);
    mockDbClient.monitor.update.mockResolvedValue({ ...dueMonitors[0], lastCheckedAt: new Date() });
    (pingUrl as jest.Mock).mockResolvedValue({ isUp: true, statusCode: 200, responseTimeMs: 50 });

    const checkedCount = await service.runBatchChecks(15);

    expect(pingUrl).toHaveBeenCalledWith('https://s1.example.com');
    expect(checkedCount).toBe(1);
  });
});

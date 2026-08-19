import { db, DbClient } from '../../../infrastructure/db/postgres/client.js';
import { CreateMonitorDTO, MonitorDTO, CheckResultDTO } from './dto.js';
import { APP_CONSTANTS } from '../../../config/constants.js';
import { pingUrl } from './checker.service.js';

export class UptimeService {
  constructor(private readonly dbClient: DbClient = db) {}

  private mapMonitorToDTO(m: any): MonitorDTO {
    return {
      id: m.id,
      organisationId: m.organisationId,
      name: m.name,
      type: m.type as MonitorDTO['type'],
      url: m.url,
      intervalSeconds: m.intervalSeconds,
      status: m.status as MonitorDTO['status'],
      consecutiveFails: m.consecutiveFails ?? 0,
      lastCheckedAt: m.lastCheckedAt ?? null,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    };
  }

  async createMonitor(input: CreateMonitorDTO): Promise<MonitorDTO> {
    const intervalSeconds = input.intervalSeconds || APP_CONSTANTS.DEFAULT_PING_INTERVAL_SECONDS;
    const type = input.type || 'http';

    const monitor = await this.dbClient.monitor.create({
      data: {
        organisationId: input.organisationId,
        name: input.name,
        type,
        url: input.url,
        intervalSeconds,
        status: 'up',
      },
    });

    return this.mapMonitorToDTO(monitor);
  }

  async getMonitorsByOrganisation(organisationId: string): Promise<MonitorDTO[]> {
    const monitors = await this.dbClient.monitor.findMany({
      where: { organisationId },
      orderBy: { createdAt: 'desc' },
    });

    return monitors.map((m: any) => this.mapMonitorToDTO(m));
  }

  async getMonitorsDueForCheck(now: Date = new Date()): Promise<MonitorDTO[]> {
    const allMonitors = await this.dbClient.monitor.findMany();
    const dueMonitors = allMonitors.filter((m: any) => {
      if (!m.lastCheckedAt) return true;
      const lastCheckTime = new Date(m.lastCheckedAt).getTime();
      const intervalMs = (m.intervalSeconds || APP_CONSTANTS.DEFAULT_PING_INTERVAL_SECONDS) * 1000;
      return lastCheckTime + intervalMs <= now.getTime();
    });
    return dueMonitors.map((m: any) => this.mapMonitorToDTO(m));
  }

  async processMonitorCheck(monitorOrId: string | MonitorDTO, result: CheckResultDTO): Promise<MonitorDTO> {
    const monitor = typeof monitorOrId === 'string'
      ? await this.dbClient.monitor.findUnique({ where: { id: monitorOrId } })
      : monitorOrId;

    if (!monitor) {
      const idStr = typeof monitorOrId === 'string' ? monitorOrId : (monitorOrId as any)?.id;
      throw new Error(`Monitor with ID ${idStr} not found`);
    }

    const now = new Date();
    let newConsecutiveFails = 0;
    let newStatus = monitor.status;

    if (result.isUp) {
      newConsecutiveFails = 0;
      newStatus = 'up';
    } else {
      newConsecutiveFails = (monitor.consecutiveFails || 0) + 1;
      if (newConsecutiveFails >= APP_CONSTANTS.DEFAULT_CONSECUTIVE_FAILURES_BEFORE_INCIDENT) {
        newStatus = 'down';
      }
    }

    const updated = await this.dbClient.monitor.update({
      where: { id: monitor.id },
      data: {
        lastCheckedAt: now,
        consecutiveFails: newConsecutiveFails,
        status: newStatus,
      },
    });

    return this.mapMonitorToDTO(updated);
  }

  async runBatchChecks(concurrencyLimit: number = 15): Promise<number> {
    const dueMonitors = await this.getMonitorsDueForCheck();
    if (dueMonitors.length === 0) return 0;

    for (let i = 0; i < dueMonitors.length; i += concurrencyLimit) {
      const batch = dueMonitors.slice(i, i + concurrencyLimit);
      await Promise.all(
        batch.map(async (m) => {
          try {
            const checkResult = await pingUrl(m.url);
            await this.processMonitorCheck(m, checkResult);
          } catch (err) {
            await this.processMonitorCheck(m, {
              isUp: false,
              statusCode: 0,
              responseTimeMs: 0,
              error: err instanceof Error ? err.message : 'Execution error',
            });
          }
        })
      );
    }

    return dueMonitors.length;
  }
}

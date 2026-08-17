import { db } from '../../../infrastructure/db/postgres/client.js';
import { CreateMonitorInput, MonitorDTO } from '../types.js';

export async function createMonitor(input: CreateMonitorInput): Promise<MonitorDTO> {
  const monitor = await db.monitors.create({
    data: {
      teamId: input.teamId,
      name: input.name,
      url: input.url,
      intervalSeconds: input.intervalSeconds || 60,
      status: 'up',
    },
  });

  return {
    id: monitor.id,
    teamId: monitor.teamId,
    name: monitor.name,
    url: monitor.url,
    intervalSeconds: monitor.intervalSeconds,
    status: monitor.status as MonitorDTO['status'],
    createdAt: monitor.createdAt,
  };
}

export async function getMonitorsByTeam(teamId: string): Promise<MonitorDTO[]> {
  const monitors = await db.monitors.findMany({
    where: { teamId },
    orderBy: { createdAt: 'desc' },
  });

  return monitors.map((m) => ({
    id: m.id,
    teamId: m.teamId,
    name: m.name,
    url: m.url,
    intervalSeconds: m.intervalSeconds,
    status: m.status as MonitorDTO['status'],
    createdAt: m.createdAt,
  }));
}


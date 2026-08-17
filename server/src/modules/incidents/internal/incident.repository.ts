import { db } from '../../../infrastructure/db/postgres/client.js';
import { IncidentDTO } from '../types.js';

export async function createIncident(teamId: string, monitorId: string, title: string): Promise<IncidentDTO> {
  const incident = await db.incidents.create({
    data: {
      teamId,
      monitorId,
      title,
      status: 'investigating',
    },
  });

  return {
    id: incident.id,
    teamId: incident.teamId,
    monitorId: incident.monitorId,
    title: incident.title,
    status: incident.status as IncidentDTO['status'],
    startedAt: incident.startedAt,
    resolvedAt: incident.resolvedAt || undefined,
  };
}


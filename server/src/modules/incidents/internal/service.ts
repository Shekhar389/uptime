import { db, DbClient } from '../../../infrastructure/db/postgres/client.js';
import { IncidentDTO } from '../types.js';

export class IncidentService {
  constructor(private readonly dbClient: DbClient = db) {}

  async createIncident(teamId: string, monitorId: string, title: string): Promise<IncidentDTO> {
    const incident = await this.dbClient.incident.create({
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
}

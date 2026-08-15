import { postgresPool } from '../../../infrastructure/db/postgres/client.js';
import { IncidentDTO } from '../types.js';

export async function createIncident(teamId: string, monitorId: string, title: string): Promise<IncidentDTO> {
  const result = await postgresPool.query(
    `INSERT INTO incidents (team_id, monitor_id, title, status)
     VALUES ($1, $2, $3, 'investigating')
     RETURNING id, team_id as "teamId", monitor_id as "monitorId", title, status, started_at as "startedAt"`,
    [teamId, monitorId, title]
  );
  return result.rows[0];
}

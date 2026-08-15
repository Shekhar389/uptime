import { postgresPool } from '../../../infrastructure/db/postgres/client.js';
import { CreateMonitorInput, MonitorDTO } from '../types.js';

export async function createMonitor(input: CreateMonitorInput): Promise<MonitorDTO> {
  const result = await postgresPool.query(
    `INSERT INTO monitors (team_id, name, url, interval_seconds, status)
     VALUES ($1, $2, $3, $4, 'up')
     RETURNING id, team_id as "teamId", name, url, interval_seconds as "intervalSeconds", status, created_at as "createdAt"`,
    [input.teamId, input.name, input.url, input.intervalSeconds || 60]
  );
  return result.rows[0];
}

export async function getMonitorsByTeam(teamId: string): Promise<MonitorDTO[]> {
  const result = await postgresPool.query(
    `SELECT id, team_id as "teamId", name, url, interval_seconds as "intervalSeconds", status, created_at as "createdAt"
     FROM monitors WHERE team_id = $1 ORDER BY created_at DESC`,
    [teamId]
  );
  return result.rows;
}

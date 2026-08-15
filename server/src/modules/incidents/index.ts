import { IncidentDTO } from './types.js';
import { createIncident } from './internal/incident.repository.js';
import { evaluateEscalation } from './internal/escalation-engine.js';

export * from './types.js';
export * from './incident.validator.js';

export async function triggerIncident(teamId: string, monitorId: string, title: string): Promise<IncidentDTO> {
  const incident = await createIncident(teamId, monitorId, title);
  evaluateEscalation(incident);
  return incident;
}

import { IncidentDTO } from './types.js';
import { IncidentService } from './internal/service.js';
import { evaluateEscalation } from './internal/escalation-engine.js';

const defaultIncidentService = new IncidentService();

export * from './types.js';
export * from './incident.validator.js';
export { IncidentService } from './internal/service.js';

export async function triggerIncident(teamId: string, monitorId: string, title: string): Promise<IncidentDTO> {
  const incident = await defaultIncidentService.createIncident(teamId, monitorId, title);
  evaluateEscalation(incident);
  return incident;
}

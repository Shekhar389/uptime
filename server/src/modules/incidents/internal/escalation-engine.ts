import { IncidentDTO } from '../types.js';

export function evaluateEscalation(incident: IncidentDTO): string {
  return `Escalating incident ${incident.id} for monitor ${incident.monitorId}`;
}

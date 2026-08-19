import { CreateMonitorDTO, MonitorDTO, CheckResultDTO } from './internal/dto.js';
import { UptimeService } from './internal/service.js';
import { pingUrl } from './internal/checker.service.js';
import { calculateSLA } from './internal/latency-calc.js';

const defaultService = new UptimeService();

export * from './types.js';
export * from './uptime.validator.js';
export { UptimeController } from './internal/controller.js';
export { UptimeService } from './internal/service.js';

export async function addMonitor(input: CreateMonitorDTO): Promise<MonitorDTO> {
  return defaultService.createMonitor(input);
}

export async function listOrganisationMonitors(organisationId: string): Promise<MonitorDTO[]> {
  return defaultService.getMonitorsByOrganisation(organisationId);
}

export async function listTeamMonitors(teamId: string): Promise<MonitorDTO[]> {
  return defaultService.getMonitorsByOrganisation(teamId);
}

export async function executeCheck(url: string): Promise<CheckResultDTO> {
  return pingUrl(url);
}

export function computeAvailability(total: number, failed: number): number {
  return calculateSLA(total, failed);
}

export async function runMonitoringBatch(concurrencyLimit: number = 15): Promise<number> {
  return defaultService.runBatchChecks(concurrencyLimit);
}

import { CreateMonitorInput, MonitorDTO, CheckResult } from './types.js';
import { createMonitor, getMonitorsByTeam } from './internal/monitor.repository.js';
import { pingUrl } from './internal/checker.service.js';
import { calculateSLA } from './internal/latency-calc.js';

export * from './types.js';
export * from './uptime.validator.js';

export async function addMonitor(input: CreateMonitorInput): Promise<MonitorDTO> {
  return createMonitor(input);
}

export async function listTeamMonitors(teamId: string): Promise<MonitorDTO[]> {
  return getMonitorsByTeam(teamId);
}

export async function executeCheck(url: string): Promise<CheckResult> {
  return pingUrl(url);
}

export function computeAvailability(total: number, failed: number): number {
  return calculateSLA(total, failed);
}

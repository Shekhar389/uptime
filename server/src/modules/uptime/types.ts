export interface CreateMonitorInput {
  teamId: string;
  name: string;
  url: string;
  intervalSeconds?: number;
}

export interface MonitorDTO {
  id: string;
  teamId: string;
  name: string;
  url: string;
  intervalSeconds: number;
  status: 'up' | 'down' | 'degraded' | 'paused';
  createdAt: Date;
}

export interface CheckResult {
  isUp: boolean;
  statusCode: number;
  responseTimeMs: number;
  error?: string;
}

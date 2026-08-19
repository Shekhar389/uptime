export type MonitorTypeDTO = 'http';
export type MonitorStatusDTO = 'up' | 'down' | 'degraded';

export interface CreateMonitorInputDTO {
  name: string;
  url: string;
  type?: MonitorTypeDTO;
  intervalSeconds?: number;
}

export interface CreateMonitorDTO {
  organisationId: string;
  name: string;
  url: string;
  type: MonitorTypeDTO;
  intervalSeconds: number;
}

export interface MonitorDTO {
  id: string;
  organisationId: string;
  name: string;
  type: MonitorTypeDTO;
  url: string;
  intervalSeconds: number;
  status: MonitorStatusDTO;
  consecutiveFails: number;
  lastCheckedAt?: Date | null;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CheckResultDTO {
  isUp: boolean;
  statusCode: number;
  responseTimeMs: number;
  error?: string;
}

import {
  MonitorTypeDTO,
  MonitorStatusDTO,
  CreateMonitorInputDTO,
  CreateMonitorDTO,
  MonitorDTO,
  CheckResultDTO,
} from './internal/dto.js';

export {
  MonitorTypeDTO,
  MonitorStatusDTO,
  CreateMonitorInputDTO,
  CreateMonitorDTO,
  MonitorDTO,
  CheckResultDTO,
};

export interface CheckResult {
  isUp: boolean;
  statusCode: number;
  responseTimeMs: number;
  error?: string;
}

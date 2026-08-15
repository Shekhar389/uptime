export interface IncidentDTO {
  id: string;
  teamId: string;
  monitorId: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  startedAt: Date;
  resolvedAt?: Date;
}

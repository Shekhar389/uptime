export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface Monitor {
  id: string;
  teamId: string;
  name: string;
  url: string;
  intervalSeconds: number;
  status: 'up' | 'down' | 'degraded' | 'paused';
  lastCheckedAt?: Date;
  createdAt: Date;
}

export interface Incident {
  id: string;
  teamId: string;
  monitorId: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  startedAt: Date;
  resolvedAt?: Date;
}

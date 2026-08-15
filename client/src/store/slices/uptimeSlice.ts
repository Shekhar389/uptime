import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Monitor {
  id: string;
  name: string;
  url: string;
  intervalSeconds: number;
  status: 'up' | 'down' | 'degraded';
  lastCheckedAt?: string;
  latencyMs?: number;
}

export interface UptimeState {
  monitors: Monitor[];
  filter: 'all' | 'up' | 'down';
  selectedMonitorId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UptimeState = {
  monitors: [
    { id: 'mon-1', name: 'Primary API Gateway', url: 'https://api.acme.com/health', intervalSeconds: 30, status: 'up', latencyMs: 42, lastCheckedAt: 'Just now' },
    { id: 'mon-2', name: 'Customer Dashboard', url: 'https://app.acme.com', intervalSeconds: 60, status: 'up', latencyMs: 115, lastCheckedAt: '1 min ago' },
    { id: 'mon-3', name: 'Auth Microservice', url: 'https://auth.acme.com/ping', intervalSeconds: 15, status: 'degraded', latencyMs: 480, lastCheckedAt: 'Just now' },
    { id: 'mon-4', name: 'Payment Webhook Listener', url: 'https://pay.acme.com/webhooks', intervalSeconds: 60, status: 'down', latencyMs: 0, lastCheckedAt: '2 mins ago' },
  ],
  filter: 'all',
  selectedMonitorId: null,
  loading: false,
  error: null,
};

export const uptimeSlice = createSlice({
  name: 'uptime',
  initialState,
  reducers: {
    setMonitors: (state, action: PayloadAction<Monitor[]>) => {
      state.monitors = action.payload;
    },
    addMonitor: (state, action: PayloadAction<Omit<Monitor, 'id'>>) => {
      const newMonitor: Monitor = {
        ...action.payload,
        id: `mon-${Date.now()}`,
        lastCheckedAt: 'Pending',
      };
      state.monitors.unshift(newMonitor);
    },
    updateMonitor: (state, action: PayloadAction<Monitor>) => {
      const index = state.monitors.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.monitors[index] = action.payload;
      }
    },
    deleteMonitor: (state, action: PayloadAction<string>) => {
      state.monitors = state.monitors.filter((m) => m.id !== action.payload);
    },
    setFilter: (state, action: PayloadAction<'all' | 'up' | 'down'>) => {
      state.filter = action.payload;
    },
    setSelectedMonitorId: (state, action: PayloadAction<string | null>) => {
      state.selectedMonitorId = action.payload;
    },
  },
});

export const { setMonitors, addMonitor, updateMonitor, deleteMonitor, setFilter, setSelectedMonitorId } = uptimeSlice.actions;
export default uptimeSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'major' | 'minor';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  createdAt: string;
  description: string;
}

export interface IncidentsState {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
}

const initialState: IncidentsState = {
  incidents: [
    {
      id: 'inc-101',
      title: 'Increased API Latency in US-East Region',
      severity: 'major',
      status: 'monitoring',
      createdAt: '2026-08-15 09:30 UTC',
      description: 'Database query pool saturation caused spikes in gateway latency.',
    },
    {
      id: 'inc-100',
      title: 'Payment Gateway Webhook Timeout',
      severity: 'critical',
      status: 'investigating',
      createdAt: '2026-08-15 08:15 UTC',
      description: 'Stripe webhook listener failing to return 200 OK within 5s window.',
    },
  ],
  loading: false,
  error: null,
};

export const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    addIncident: (state, action: PayloadAction<Omit<Incident, 'id' | 'createdAt'>>) => {
      const newInc: Incident = {
        ...action.payload,
        id: `inc-${Date.now()}`,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      };
      state.incidents.unshift(newInc);
    },
    updateIncidentStatus: (
      state,
      action: PayloadAction<{ id: string; status: Incident['status'] }>
    ) => {
      const inc = state.incidents.find((i) => i.id === action.payload.id);
      if (inc) {
        inc.status = action.payload.status;
      }
    },
  },
});

export const { addIncident, updateIncidentStatus } = incidentsSlice.actions;
export default incidentsSlice.reducer;

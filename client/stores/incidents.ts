import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'major' | 'minor';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  createdAt: string;
  description: string;
}

export const useIncidentsStore = defineStore('incidents', () => {
  const incidents = ref<Incident[]>([
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
  ]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  function addIncident(data: Omit<Incident, 'id' | 'createdAt'>) {
    const newInc: Incident = {
      ...data,
      id: `inc-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    };
    incidents.value.unshift(newInc);
  }

  function updateIncidentStatus(id: string, status: Incident['status']) {
    const inc = incidents.value.find((i) => i.id === id);
    if (inc) {
      inc.status = status;
    }
  }

  return {
    incidents,
    loading,
    error,
    addIncident,
    updateIncidentStatus,
  };
});

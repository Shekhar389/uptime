import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApiClient } from '~/composables/useApiClient';

export interface Monitor {
  id: string;
  name: string;
  url: string;
  intervalSeconds: number;
  status: 'up' | 'down' | 'degraded';
  lastCheckedAt?: string;
  latencyMs?: number;
}

export const useUptimeStore = defineStore('uptime', () => {
  const monitors = ref<Monitor[]>([
    {
      id: 'mon-1',
      name: 'Primary API Gateway',
      url: 'https://api.acme.com/health',
      intervalSeconds: 30,
      status: 'up',
      latencyMs: 42,
      lastCheckedAt: 'Just now',
    },
    {
      id: 'mon-2',
      name: 'Customer Dashboard',
      url: 'https://app.acme.com',
      intervalSeconds: 60,
      status: 'up',
      latencyMs: 115,
      lastCheckedAt: '1 min ago',
    },
    {
      id: 'mon-3',
      name: 'Auth Microservice',
      url: 'https://auth.acme.com/ping',
      intervalSeconds: 15,
      status: 'degraded',
      latencyMs: 480,
      lastCheckedAt: 'Just now',
    },
    {
      id: 'mon-4',
      name: 'Payment Webhook Listener',
      url: 'https://pay.acme.com/webhooks',
      intervalSeconds: 60,
      status: 'down',
      latencyMs: 0,
      lastCheckedAt: '2 mins ago',
    },
  ]);
  const filter = ref<'all' | 'up' | 'down'>('all');
  const selectedMonitorId = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const totalUp = computed(() => monitors.value.filter((m) => m.status === 'up').length);
  const totalDegraded = computed(() => monitors.value.filter((m) => m.status === 'degraded').length);
  const totalDown = computed(() => monitors.value.filter((m) => m.status === 'down').length);

  async function fetchMonitors() {
    loading.value = true;
    error.value = null;
    try {
      const api = useApiClient();
      const data = await api<Monitor[]>('/monitors');
      if (Array.isArray(data)) {
        monitors.value = data;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch monitors';
    } finally {
      loading.value = false;
    }
  }

  function setMonitors(data: Monitor[]) {
    monitors.value = data;
  }

  function addMonitor(data: Omit<Monitor, 'id'>) {
    const newMonitor: Monitor = {
      ...data,
      id: `mon-${Date.now()}`,
      lastCheckedAt: 'Pending',
    };
    monitors.value.unshift(newMonitor);
  }

  function updateMonitor(updated: Monitor) {
    const index = monitors.value.findIndex((m) => m.id === updated.id);
    if (index !== -1) {
      monitors.value[index] = updated;
    }
  }

  function deleteMonitor(id: string) {
    monitors.value = monitors.value.filter((m) => m.id !== id);
  }

  function setFilter(newFilter: 'all' | 'up' | 'down') {
    filter.value = newFilter;
  }

  function setSelectedMonitorId(id: string | null) {
    selectedMonitorId.value = id;
  }

  return {
    monitors,
    filter,
    selectedMonitorId,
    loading,
    error,
    totalUp,
    totalDegraded,
    totalDown,
    fetchMonitors,
    setMonitors,
    addMonitor,
    updateMonitor,
    deleteMonitor,
    setFilter,
    setSelectedMonitorId,
  };
});

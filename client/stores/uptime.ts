import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApiClient } from '~/composables/useApiClient';

export interface Monitor {
  id: string;
  organisationId?: string;
  name: string;
  type?: 'http';
  url: string;
  intervalSeconds: number;
  status: 'up' | 'down' | 'degraded';
  lastCheckedAt?: string;
  latencyMs?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const useUptimeStore = defineStore('uptime', () => {
  const monitors = ref<Monitor[]>([]);
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
      const res = await api<{ data: Monitor[] } | Monitor[]>('/monitors');
      const list = Array.isArray(res) ? res : res?.data;
      if (Array.isArray(list)) {
        monitors.value = list;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch monitors';
    } finally {
      loading.value = false;
    }
  }

  async function createMonitor(input: { name: string; url: string; intervalSeconds?: number; type?: 'http' }) {
    loading.value = true;
    error.value = null;
    try {
      const api = useApiClient();
      const res = await api<{ data: Monitor } | Monitor>('/monitors', {
        method: 'POST',
        body: input,
      });
      const created = (res as any)?.data || res;
      if (created && created.id) {
        monitors.value.unshift(created);
      }
      return created;
    } catch (err: any) {
      error.value = err.message || 'Failed to create monitor';
      throw err;
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
    createMonitor,
    setMonitors,
    addMonitor,
    updateMonitor,
    deleteMonitor,
    setFilter,
    setSelectedMonitorId,
  };
});

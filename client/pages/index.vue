<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header & Dialog Action -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
      <div>
        <h1 class="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
          <UIcon name="i-heroicons-chart-bar" class="text-zinc-100 w-6 h-6" /> Uptime Monitors
        </h1>
        <p class="text-zinc-400 text-xs mt-1">
          Real-time HTTP health checks, ping latency tracking, and SLA verification.
        </p>
      </div>

      <UButton
        class="gap-2 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold shadow-sm"
        @click="isOpen = true"
      >
        <UIcon name="i-heroicons-plus" class="w-4 h-4" /> Add Monitor
      </UButton>
    </div>

    <!-- Modal Form for Adding Monitor -->
    <UModal v-model="isOpen">
      <UCard class="bg-zinc-900 border-zinc-800 text-zinc-100">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white">Create Health Check</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="isOpen = false" />
          </div>
          <p class="text-xs text-zinc-400 mt-1">
            Configure a target HTTP or HTTPS URL to poll for status code & SLA latency.
          </p>
        </template>

        <UForm :schema="createMonitorSchema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="MONITOR NAME" name="name" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <UInput v-model="state.name" placeholder="e.g. Primary API Gateway" class="bg-zinc-950 border-zinc-800 text-zinc-100" />
          </UFormGroup>

          <UFormGroup label="URL ENDPOINT" name="url" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <UInput v-model="state.url" placeholder="https://api.acme.com/health" class="bg-zinc-950 border-zinc-800 text-zinc-100" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-3">
            <UFormGroup label="INTERVAL (SEC)" name="intervalSeconds" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              <UInput v-model.number="state.intervalSeconds" type="number" placeholder="60" class="bg-zinc-950 border-zinc-800 text-zinc-100" />
            </UFormGroup>

            <UFormGroup label="STATUS" name="status" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              <USelect
                v-model="state.status"
                :options="statusOptions"
                option-attribute="label"
                value-attribute="value"
                class="bg-zinc-950 border-zinc-800 text-zinc-100"
              />
            </UFormGroup>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-zinc-800">
            <UButton variant="ghost" color="gray" @click="isOpen = false">Cancel</UButton>
            <UButton type="submit" class="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold">Save Monitor</UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>

    <!-- Metric Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <UCard class="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-sm">
        <div class="flex flex-row items-center justify-between">
          <span class="text-xs font-medium text-zinc-400 uppercase tracking-wider">Total Active</span>
          <UIcon name="i-heroicons-globe-alt" class="h-4 w-4 text-zinc-300" />
        </div>
        <div class="text-2xl font-bold text-white font-mono mt-2">{{ uptimeStore.monitors.length }}</div>
        <p class="text-[11px] text-zinc-500 mt-1">Monitored target URLs</p>
      </UCard>

      <UCard class="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-sm">
        <div class="flex flex-row items-center justify-between">
          <span class="text-xs font-medium text-zinc-400 uppercase tracking-wider">Healthy (Up)</span>
          <UIcon name="i-heroicons-shield-check" class="h-4 w-4 text-zinc-100" />
        </div>
        <div class="text-2xl font-bold text-zinc-100 font-mono mt-2">{{ totalUp }}</div>
        <p class="text-[11px] text-zinc-500 mt-1">Passing checks</p>
      </UCard>

      <UCard class="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-sm">
        <div class="flex flex-row items-center justify-between">
          <span class="text-xs font-medium text-zinc-400 uppercase tracking-wider">Degraded</span>
          <UIcon name="i-heroicons-clock" class="h-4 w-4 text-zinc-400" />
        </div>
        <div class="text-2xl font-bold text-zinc-300 font-mono mt-2">{{ totalDegraded }}</div>
        <p class="text-[11px] text-zinc-500 mt-1">High response latency</p>
      </UCard>

      <UCard class="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-sm">
        <div class="flex flex-row items-center justify-between">
          <span class="text-xs font-medium text-zinc-400 uppercase tracking-wider">Outages (Down)</span>
          <UIcon name="i-heroicons-chart-bar" class="h-4 w-4 text-zinc-500" />
        </div>
        <div class="text-2xl font-bold text-zinc-400 font-mono mt-2">{{ totalDown }}</div>
        <p class="text-[11px] text-zinc-500 mt-1">HTTP errors reported</p>
      </UCard>
    </div>

    <!-- Main Table Card -->
    <UCard class="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-sm overflow-hidden" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <template #header>
        <div class="flex flex-row items-center justify-between">
          <div>
            <h3 class="text-base font-semibold text-white">Monitored Endpoints</h3>
            <p class="text-xs text-zinc-400">Live checks with active status filter</p>
          </div>
          <div class="flex items-center gap-1 bg-zinc-950 p-1 rounded-md border border-zinc-800">
            <UButton
              size="xs"
              variant="ghost"
              :class="uptimeStore.filter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400'"
              @click="uptimeStore.setFilter('all')"
            >
              All ({{ uptimeStore.monitors.length }})
            </UButton>
            <UButton
              size="xs"
              variant="ghost"
              :class="uptimeStore.filter === 'up' ? 'bg-zinc-800 text-white' : 'text-zinc-400'"
              @click="uptimeStore.setFilter('up')"
            >
              Up ({{ totalUp }})
            </UButton>
            <UButton
              size="xs"
              variant="ghost"
              :class="uptimeStore.filter === 'down' ? 'bg-zinc-800 text-white' : 'text-zinc-400'"
              @click="uptimeStore.setFilter('down')"
            >
              Down ({{ totalDown }})
            </UButton>
          </div>
        </div>
      </template>

      <UTable :columns="columns" :rows="filteredMonitors">
        <template #status-data="{ row }">
          <UBadge
            variant="outline"
            :class="
              row.status === 'up'
                ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold'
                : row.status === 'degraded'
                ? 'bg-zinc-800 text-zinc-300 border-zinc-700'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800'
            "
            class="text-[11px] font-mono uppercase tracking-wider"
          >
            {{ row.status }}
          </UBadge>
        </template>

        <template #url-data="{ row }">
          <span class="font-mono text-xs text-zinc-400">{{ row.url }}</span>
        </template>

        <template #latencyMs-data="{ row }">
          <span class="text-zinc-300 font-mono text-xs">{{ row.latencyMs ? `${row.latencyMs} ms` : 'N/A' }}</span>
        </template>

        <template #intervalSeconds-data="{ row }">
          <span class="text-zinc-400 text-xs font-mono">{{ row.intervalSeconds }}s</span>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="rowActions(row)" :popper="{ placement: 'bottom-end' }">
            <UButton variant="ghost" icon="i-heroicons-ellipsis-horizontal" class="h-8 w-8 p-0 text-zinc-400 hover:text-white" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { createMonitorSchema, type CreateMonitorInput } from '~/utils/schemas/uptime';
import { useUptimeStore, type Monitor } from '~/stores/uptime';

const uptimeStore = useUptimeStore();
const isOpen = ref(false);

const state = reactive<CreateMonitorInput>({
  name: '',
  url: '',
  intervalSeconds: 60,
  status: 'up',
});

const statusOptions = [
  { label: 'Up (Healthy)', value: 'up' },
  { label: 'Degraded', value: 'degraded' },
  { label: 'Down (Outage)', value: 'down' },
];

const columns = [
  { key: 'name', label: 'Endpoint Name' },
  { key: 'status', label: 'Status' },
  { key: 'url', label: 'URL' },
  { key: 'latencyMs', label: 'Latency' },
  { key: 'intervalSeconds', label: 'Interval' },
  { key: 'actions', label: '' },
];

const filteredMonitors = computed(() => {
  if (uptimeStore.filter === 'all') return uptimeStore.monitors;
  return uptimeStore.monitors.filter((m) => m.status === uptimeStore.filter);
});

const totalUp = computed(() => uptimeStore.monitors.filter((m) => m.status === 'up').length);
const totalDegraded = computed(() => uptimeStore.monitors.filter((m) => m.status === 'degraded').length);
const totalDown = computed(() => uptimeStore.monitors.filter((m) => m.status === 'down').length);

const onSubmit = () => {
  uptimeStore.addMonitor({ ...state });
  state.name = '';
  state.url = '';
  state.intervalSeconds = 60;
  state.status = 'up';
  isOpen.value = false;
};

const rowActions = (row: Monitor) => [
  [
    {
      label: 'Trigger Check',
      icon: 'i-heroicons-arrow-path',
      click: () => {},
    },
    {
      label: 'Open URL',
      icon: 'i-heroicons-arrow-top-right-on-square',
      click: () => {
        if (typeof window !== 'undefined') window.open(row.url, '_blank');
      },
    },
  ],
  [
    {
      label: 'Delete',
      icon: 'i-heroicons-trash',
      click: () => uptimeStore.deleteMonitor(row.id),
    },
  ],
];
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <UIcon name="i-heroicons-exclamation-triangle" class="text-amber-400 w-7 h-7" /> Incidents & On-Call Escalations
        </h1>
        <p class="text-zinc-400 text-xs mt-1">
          Active incident tracking, automated escalation triggers, and audit log history.
        </p>
      </div>

      <UButton
        class="gap-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold"
        @click="isOpen = true"
      >
        <UIcon name="i-heroicons-plus" class="w-4 h-4" /> Declare Incident
      </UButton>
    </div>

    <!-- Declare Incident Modal -->
    <UModal v-model="isOpen">
      <UCard class="bg-zinc-900 border-zinc-800 text-zinc-100">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <UIcon name="i-heroicons-shield-exclamation" class="text-rose-400 w-5 h-5" /> Declare New Incident
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" class="-my-1" @click="isOpen = false" />
          </div>
          <p class="text-xs text-zinc-400 mt-1">
            Broadcast status changes to status page and on-call engineers.
          </p>
        </template>

        <UForm :schema="createIncidentSchema" :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="TITLE" name="title" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <UInput v-model="state.title" placeholder="e.g. Stripe Webhook Timeout" class="bg-zinc-950 border-zinc-800 text-zinc-100" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-3">
            <UFormGroup label="SEVERITY" name="severity" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              <USelect v-model="state.severity" :options="severityOptions" option-attribute="label" value-attribute="value" class="bg-zinc-950 border-zinc-800 text-zinc-100" />
            </UFormGroup>

            <UFormGroup label="STATUS" name="status" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              <USelect v-model="state.status" :options="statusOptions" option-attribute="label" value-attribute="value" class="bg-zinc-950 border-zinc-800 text-zinc-100" />
            </UFormGroup>
          </div>

          <UFormGroup label="DESCRIPTION" name="description" class="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <UInput v-model="state.description" placeholder="Detail impact and steps being taken..." class="bg-zinc-950 border-zinc-800 text-zinc-100" />
          </UFormGroup>

          <div class="flex justify-end gap-2 pt-3 border-t border-zinc-800">
            <UButton variant="ghost" color="gray" @click="isOpen = false">Cancel</UButton>
            <UButton type="submit" class="bg-rose-600 hover:bg-rose-500 text-white font-semibold">Broadcast Incident</UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>

    <!-- Incident Cards -->
    <div class="space-y-4">
      <UCard
        v-for="inc in incidentsStore.incidents"
        :key="inc.id"
        class="bg-zinc-900/90 border-zinc-800 shadow-sm"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <UBadge
                variant="subtle"
                :class="
                  inc.severity === 'critical'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : inc.severity === 'major'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-zinc-800 text-zinc-300'
                "
              >
                {{ inc.severity }}
              </UBadge>
              <h3 class="text-base font-bold text-white">{{ inc.title }}</h3>
            </div>
            <span class="text-xs font-mono text-zinc-500">{{ inc.createdAt }}</span>
          </div>
          <p class="text-sm text-zinc-300 pt-2">{{ inc.description }}</p>
        </template>

        <div class="flex items-center justify-between border-t border-zinc-800/60 pt-3">
          <div class="flex items-center gap-2">
            <span class="text-xs text-zinc-400">Current Status:</span>
            <UBadge
              :variant="inc.status === 'resolved' ? 'solid' : 'subtle'"
              :class="inc.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-300'"
            >
              {{ inc.status }}
            </UBadge>
          </div>

          <UButton
            v-if="inc.status !== 'resolved'"
            size="xs"
            variant="outline"
            class="gap-1 text-xs text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
            @click="incidentsStore.updateIncidentStatus(inc.id, 'resolved')"
          >
            <UIcon name="i-heroicons-check-circle" class="w-4 h-4" /> Mark Resolved
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createIncidentSchema, type CreateIncidentInput } from '~/utils/schemas/incidents';
import { useIncidentsStore } from '~/stores/incidents';

const incidentsStore = useIncidentsStore();
const isOpen = ref(false);

const state = reactive<CreateIncidentInput>({
  title: '',
  severity: 'major',
  status: 'investigating',
  description: '',
});

const severityOptions = [
  { label: 'Minor Impact', value: 'minor' },
  { label: 'Major Outage', value: 'major' },
  { label: 'Critical Down', value: 'critical' },
];

const statusOptions = [
  { label: 'Investigating', value: 'investigating' },
  { label: 'Identified', value: 'identified' },
  { label: 'Monitoring', value: 'monitoring' },
  { label: 'Resolved', value: 'resolved' },
];

const onSubmit = () => {
  incidentsStore.addIncident({ ...state });
  state.title = '';
  state.severity = 'major';
  state.status = 'investigating';
  state.description = '';
  isOpen.value = false;
};
</script>

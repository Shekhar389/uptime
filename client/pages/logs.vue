<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <div>
      <h1 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
        <UIcon name="i-heroicons-command-line" class="text-zinc-300 w-7 h-7" /> Real-time Log Explorer
      </h1>
      <p class="text-zinc-400 text-xs mt-1">
        Structured request traces, HTTP ping payload inspection, and diagnostic audit logs.
      </p>
    </div>

    <UCard class="bg-zinc-900 border-zinc-800 shadow-sm">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-white">Live Event Stream</h3>
          <UBadge variant="subtle" class="bg-zinc-800 text-zinc-300 font-mono text-xs">
            Filter: All Levels
          </UBadge>
        </div>
      </template>

      <div class="space-y-3 font-mono text-xs">
        <div v-for="log in sampleLogs" :key="log.id" class="p-3 bg-zinc-950 rounded border border-zinc-800 flex items-start gap-3">
          <UBadge
            size="xs"
            :class="
              log.level === 'ERROR'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : log.level === 'WARN'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            "
          >
            {{ log.level }}
          </UBadge>
          <span class="text-zinc-500">{{ log.timestamp }}</span>
          <span class="text-zinc-200 flex-1">{{ log.message }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const sampleLogs = [
  { id: 1, level: 'INFO', timestamp: '2026-08-18 04:15:02', message: 'HTTP GET https://api.acme.com/health returned 200 OK (42ms)' },
  { id: 2, level: 'WARN', timestamp: '2026-08-18 04:14:45', message: 'HTTP GET https://auth.acme.com/ping latency exceeded threshold (480ms)' },
  { id: 3, level: 'ERROR', timestamp: '2026-08-18 04:14:10', message: 'HTTP GET https://pay.acme.com/webhooks connection timed out after 5000ms' },
];
</script>

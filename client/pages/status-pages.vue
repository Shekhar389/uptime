<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <div>
      <h1 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
        <UIcon name="i-heroicons-shield-check" class="text-emerald-400 w-7 h-7" /> Public Status Pages
      </h1>
      <p class="text-zinc-400 text-xs mt-1">
        Customize white-labeled public status dashboards and custom domain routing.
      </p>
    </div>

    <UCard class="bg-zinc-900 border-zinc-800 shadow-sm">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-globe-alt" class="text-cyan-400 w-6 h-6" />
            <div>
              <h3 class="text-lg font-bold text-white">Default Team Status Page</h3>
              <p class="text-xs font-mono text-zinc-400">status.acme-corp.betterpulse.io</p>
            </div>
          </div>
          <UBadge variant="subtle" class="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            Live & Verified
          </UBadge>
        </div>
      </template>

      <div class="space-y-4">
        <UDivider class="border-zinc-800" />
        <div class="flex items-center justify-between text-sm">
          <span class="text-zinc-400">Custom Domain CNAME:</span>
          <span class="font-mono text-xs text-zinc-200 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">status.acme.com</span>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between items-center pt-2">
          <a
            :href="statusPageEndpoint"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline font-medium"
          >
            Visit Live Endpoint <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4" />
          </a>
          <UButton variant="outline" size="xs" class="gap-2 border-zinc-800 text-zinc-300">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-4 h-4" /> Configure CNAME
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const statusPageEndpoint = computed(() => `${baseUrl}/v1/status-pages`);
</script>

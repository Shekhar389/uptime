<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <div>
      <h1 class="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
        <UIcon name="i-heroicons-credit-card" class="text-emerald-400 w-7 h-7" /> Subscription & Quota Limits
      </h1>
      <p class="text-zinc-400 text-xs mt-1">
        Select a subscription tier that scales with your uptime frequency & monitor quota.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard
        v-for="plan in billingStore.plans"
        :key="plan.id"
        class="bg-zinc-900 border flex flex-col justify-between transition-all"
        :class="
          billingStore.currentPlanId === plan.id
            ? 'border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg'
            : 'border-zinc-800'
        "
      >
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold text-white">{{ plan.name }}</h3>
            <UBadge
              v-if="billingStore.currentPlanId === plan.id"
              variant="subtle"
              class="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            >
              Active
            </UBadge>
          </div>
          <p class="text-xs text-zinc-400 mt-1">
            Up to {{ plan.monitorsLimit }} monitors with {{ plan.pingFrequencySeconds }}s ping intervals.
          </p>
          <div class="text-3xl font-extrabold text-white pt-3">
            ${{ plan.priceMonthly }}
            <span class="text-sm font-normal text-zinc-400">/mo</span>
          </div>
        </template>

        <div class="space-y-3">
          <UDivider class="border-zinc-800 my-2" />
          <ul class="space-y-2.5 text-sm text-zinc-300">
            <li v-for="(f, i) in plan.features" :key="i" class="flex items-center gap-2">
              <UIcon name="i-heroicons-check" class="w-4 h-4 text-emerald-400" />
              <span>{{ f }}</span>
            </li>
          </ul>
        </div>

        <template #footer>
          <UButton
            block
            :variant="billingStore.currentPlanId === plan.id ? 'solid' : 'outline'"
            :class="billingStore.currentPlanId === plan.id ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'border-zinc-800 text-zinc-300'"
            @click="billingStore.selectPlan(plan.id)"
          >
            {{ billingStore.currentPlanId === plan.id ? 'Current Active Plan' : `Switch to ${plan.name}` }}
          </UButton>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBillingStore } from '~/stores/billing';

const billingStore = useBillingStore();
</script>

import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  monitorsLimit: number;
  pingFrequencySeconds: number;
  features: string[];
}

export const useBillingStore = defineStore('billing', () => {
  const currentPlanId = ref('pro');
  const plans = ref<SubscriptionPlan[]>([
    {
      id: 'free',
      name: 'Starter Free',
      priceMonthly: 0,
      monitorsLimit: 5,
      pingFrequencySeconds: 300,
      features: ['5 Monitors', '5-min frequency', 'Email alerts'],
    },
    {
      id: 'pro',
      name: 'Pro Developer',
      priceMonthly: 29,
      monitorsLimit: 50,
      pingFrequencySeconds: 60,
      features: ['50 Monitors', '1-min frequency', 'SMS & Slack alerts', 'Status pages'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Scale',
      priceMonthly: 199,
      monitorsLimit: 500,
      pingFrequencySeconds: 15,
      features: ['Unlimited Monitors', '15-sec frequency', 'Dedicated IP', 'SLA Guarantee'],
    },
  ]);
  const loading = ref(false);

  function selectPlan(planId: string) {
    currentPlanId.value = planId;
  }

  return {
    currentPlanId,
    plans,
    loading,
    selectPlan,
  };
});

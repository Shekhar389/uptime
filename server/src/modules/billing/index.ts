import { SubscriptionPlan, PlanLimits } from './types.js';
import { getLimitsForPlan } from './internal/quota.service.js';
import { createStripeCheckout } from './internal/stripe.service.js';

export * from './types.js';
export * from './billing.validator.js';

export function checkQuota(plan: SubscriptionPlan): PlanLimits {
  return getLimitsForPlan(plan);
}

export async function createCheckoutSession(teamId: string, plan: string): Promise<string> {
  return createStripeCheckout(teamId, plan);
}

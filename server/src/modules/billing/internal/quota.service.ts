import { SubscriptionPlan, PlanLimits } from '../types.js';
import { APP_CONSTANTS } from '../../../config/constants.js';

export function getLimitsForPlan(plan: SubscriptionPlan): PlanLimits {
  switch (plan) {
    case 'pro':
      return { maxMonitors: APP_CONSTANTS.MAX_MONITORS_PRO_TIER, minPingIntervalSeconds: 10 };
    case 'enterprise':
      return { maxMonitors: 1000, minPingIntervalSeconds: 5 };
    case 'free':
    default:
      return { maxMonitors: APP_CONSTANTS.MAX_MONITORS_FREE_TIER, minPingIntervalSeconds: 60 };
  }
}

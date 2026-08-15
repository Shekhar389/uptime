export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export interface PlanLimits {
  maxMonitors: number;
  minPingIntervalSeconds: number;
}

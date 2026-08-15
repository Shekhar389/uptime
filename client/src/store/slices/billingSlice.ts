import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  monitorsLimit: number;
  pingFrequencySeconds: number;
  features: string[];
}

export interface BillingState {
  currentPlanId: string;
  plans: SubscriptionPlan[];
  loading: boolean;
}

const initialState: BillingState = {
  currentPlanId: 'pro',
  plans: [
    { id: 'free', name: 'Starter Free', priceMonthly: 0, monitorsLimit: 5, pingFrequencySeconds: 300, features: ['5 Monitors', '5-min frequency', 'Email alerts'] },
    { id: 'pro', name: 'Pro Developer', priceMonthly: 29, monitorsLimit: 50, pingFrequencySeconds: 60, features: ['50 Monitors', '1-min frequency', 'SMS & Slack alerts', 'Status pages'] },
    { id: 'enterprise', name: 'Enterprise Scale', priceMonthly: 199, monitorsLimit: 500, pingFrequencySeconds: 15, features: ['Unlimited Monitors', '15-sec frequency', 'Dedicated IP', 'SLA Guarantee'] },
  ],
  loading: false,
};

export const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    selectPlan: (state, action: PayloadAction<string>) => {
      state.currentPlanId = action.payload;
    },
  },
});

export const { selectPlan } = billingSlice.actions;
export default billingSlice.reducer;

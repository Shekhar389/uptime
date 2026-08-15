import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uptimeReducer from './slices/uptimeSlice';
import incidentsReducer from './slices/incidentsSlice';
import billingReducer from './slices/billingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    uptime: uptimeReducer,
    incidents: incidentsReducer,
    billing: billingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

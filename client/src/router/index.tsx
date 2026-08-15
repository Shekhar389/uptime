import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from '../components/layout';
import { MonitorList } from '../features/uptime/MonitorList';
import { IncidentTimeline } from '../features/incidents/IncidentTimeline';
import { StatusPageCustomizer } from '../features/status-pages/StatusPageCustomizer';
import { LogExplorer } from '../features/logs/LogExplorer';
import { SubscriptionPicker } from '../features/billing/SubscriptionPicker';

export const AppRouter: React.FC = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<MonitorList />} />
        <Route path="/incidents" element={<IncidentTimeline />} />
        <Route path="/status-pages" element={<StatusPageCustomizer />} />
        <Route path="/logs" element={<LogExplorer />} />
        <Route path="/billing" element={<SubscriptionPicker />} />
      </Routes>
    </AppShell>
  );
};

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, AlertTriangle, ShieldCheck, Terminal, CreditCard } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Monitors', icon: <Activity size={18} /> },
    { to: '/incidents', label: 'Incidents', icon: <AlertTriangle size={18} /> },
    { to: '/status-pages', label: 'Status Pages', icon: <ShieldCheck size={18} /> },
    { to: '/logs', label: 'Log Explorer', icon: <Terminal size={18} /> },
    { to: '/billing', label: 'Billing', icon: <CreditCard size={18} /> },
  ];

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: '#0f1522',
        borderRight: '1px solid #232d3f',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '8px' }}>
        <Activity color="#10b981" size={24} />
        <span style={{ fontWeight: 700, fontSize: '18px', color: '#ffffff' }}>BetterPulse</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '6px',
              color: isActive ? '#10b981' : '#9ca3af',
              backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
            })}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

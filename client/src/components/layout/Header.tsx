import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export const Header: React.FC = () => {
  const { team, user } = useAuthStore();

  return (
    <header
      style={{
        height: '64px',
        borderBottom: '1px solid #232d3f',
        backgroundColor: '#0f1522',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      <div style={{ fontSize: '14px', color: '#9ca3af' }}>
        Team: <strong style={{ color: '#ffffff' }}>{team?.name || 'Acme Corp'}</strong>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
        <span style={{ fontSize: '14px', color: '#f3f4f6' }}>{user?.email}</span>
      </div>
    </header>
  );
};

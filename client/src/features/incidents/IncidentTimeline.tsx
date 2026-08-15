import React from 'react';

export const IncidentTimeline: React.FC = () => {
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Incidents & On-Call</h1>
      <p style={{ color: '#9ca3af', marginBottom: '24px' }}>Active escalations and resolved incident timeline</p>
      
      <div style={{ backgroundColor: '#151c28', padding: '24px', borderRadius: '8px', border: '1px solid #232d3f' }}>
        <p style={{ color: '#10b981', fontWeight: 600 }}>✓ All systems operational. No active incidents reported.</p>
      </div>
    </div>
  );
};

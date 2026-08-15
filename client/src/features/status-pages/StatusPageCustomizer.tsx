import React from 'react';

export const StatusPageCustomizer: React.FC = () => {
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Status Pages</h1>
      <p style={{ color: '#9ca3af', marginBottom: '24px' }}>Public status pages & custom domain setup</p>
      
      <div style={{ backgroundColor: '#151c28', padding: '24px', borderRadius: '8px', border: '1px solid #232d3f' }}>
        <p style={{ color: '#9ca3af' }}>Default Status Page: <a href="http://localhost:3001/api/v1/status-pages" target="_blank" rel="noreferrer" style={{ color: '#10b981' }}>http://localhost:3001/api/v1/status-pages</a></p>
      </div>
    </div>
  );
};

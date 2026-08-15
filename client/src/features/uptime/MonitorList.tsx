import React, { useEffect, useState } from 'react';
import { Button, Badge, Input } from '../../components/ui';
import { apiFetch } from '../../api/client';

interface Monitor {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'degraded' | 'paused';
  intervalSeconds: number;
}

export const MonitorList: React.FC = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMonitors = async () => {
    try {
      const res = await apiFetch<{ data: Monitor[] }>('/api/v1/monitors');
      setMonitors(res.data);
    } catch {
      // Fallback demo data
      setMonitors([
        { id: '1', name: 'Primary API Gateway', url: 'https://api.example.com', status: 'up', intervalSeconds: 30 },
        { id: '2', name: 'Auth Microservice', url: 'https://auth.example.com', status: 'up', intervalSeconds: 60 },
        { id: '3', name: 'Payment Webhook Service', url: 'https://pay.example.com', status: 'degraded', intervalSeconds: 15 },
      ]);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    setLoading(true);
    try {
      await apiFetch('/api/v1/monitors', {
        method: 'POST',
        body: JSON.stringify({ name, url, intervalSeconds: 60 }),
      });
      setName('');
      setUrl('');
      fetchMonitors();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Monitors</h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
            Real-time status checks & SLA monitoring
          </p>
        </div>
      </div>

      <form
        onSubmit={handleCreate}
        style={{
          backgroundColor: '#151c28',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #232d3f',
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr auto',
          gap: '16px',
          alignItems: 'end',
        }}
      >
        <Input label="Monitor Name" placeholder="e.g. Production API" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="URL Endpoint" placeholder="https://example.com/health" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : '+ Create Monitor'}
        </Button>
      </form>

      <div style={{ backgroundColor: '#151c28', borderRadius: '8px', border: '1px solid #232d3f', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #232d3f', color: '#9ca3af', fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px' }}>Name</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>URL</th>
              <th style={{ padding: '16px' }}>Interval</th>
            </tr>
          </thead>
          <tbody>
            {monitors.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid #1e2736', fontSize: '14px' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{m.name}</td>
                <td style={{ padding: '16px' }}>
                  <Badge status={m.status} />
                </td>
                <td style={{ padding: '16px', color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>{m.url}</td>
                <td style={{ padding: '16px', color: '#9ca3af' }}>{m.intervalSeconds}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

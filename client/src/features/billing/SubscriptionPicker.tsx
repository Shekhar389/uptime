import React from 'react';
import { Button } from '../../components/ui';

export const SubscriptionPicker: React.FC = () => {
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Billing & Plans</h1>
      <p style={{ color: '#9ca3af', marginBottom: '24px' }}>Choose a subscription plan matching your scale</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div style={{ backgroundColor: '#151c28', padding: '24px', borderRadius: '8px', border: '1px solid #232d3f' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Free</h2>
          <div style={{ fontSize: '28px', fontWeight: 700, margin: '16px 0' }}>$0 / mo</div>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>Up to 5 Monitors, 60s ping interval</p>
          <Button variant="secondary" style={{ width: '100%', justifyContent: 'center' }}>Current Plan</Button>
        </div>

        <div style={{ backgroundColor: '#151c28', padding: '24px', borderRadius: '8px', border: '1px solid #10b981' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#10b981' }}>Pro</h2>
          <div style={{ fontSize: '28px', fontWeight: 700, margin: '16px 0' }}>$29 / mo</div>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>Up to 50 Monitors, 10s ping interval</p>
          <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }}>Upgrade to Pro</Button>
        </div>

        <div style={{ backgroundColor: '#151c28', padding: '24px', borderRadius: '8px', border: '1px solid #232d3f' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Enterprise</h2>
          <div style={{ fontSize: '28px', fontWeight: 700, margin: '16px 0' }}>Custom</div>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>Unlimited Monitors, 5s interval, custom SLAs</p>
          <Button variant="secondary" style={{ width: '100%', justifyContent: 'center' }}>Contact Sales</Button>
        </div>
      </div>
    </div>
  );
};

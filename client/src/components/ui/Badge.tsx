import React from 'react';

interface BadgeProps {
  status: 'up' | 'down' | 'degraded' | 'paused';
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case 'up':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
      case 'down':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' };
      case 'degraded':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' };
      default:
        return { bg: 'rgba(156, 163, 175, 0.15)', text: '#9ca3af' };
    }
  };

  const { bg, text } = getColor();

  return (
    <span
      style={{
        backgroundColor: bg,
        color: text,
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
    >
      ● {status}
    </span>
  );
};

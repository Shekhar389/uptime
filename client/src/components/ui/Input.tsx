import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
      {label && <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</label>}
      <input
        style={{
          backgroundColor: '#151c28',
          border: '1px solid #232d3f',
          color: '#f3f4f6',
          padding: '10px 14px',
          borderRadius: '6px',
          fontSize: '14px',
          outline: 'none',
        }}
        {...props}
      />
    </div>
  );
};

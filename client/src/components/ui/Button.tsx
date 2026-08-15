import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, style, ...props }) => {
  const getBackground = () => {
    switch (variant) {
      case 'secondary':
        return '#232d3f';
      case 'danger':
        return '#ef4444';
      default:
        return '#10b981';
    }
  };

  return (
    <button
      style={{
        backgroundColor: getBackground(),
        color: '#ffffff',
        padding: '8px 16px',
        borderRadius: '6px',
        fontWeight: 600,
        fontSize: '14px',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

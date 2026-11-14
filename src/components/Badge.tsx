// ponytail: accessible badge for movement, style, and metadata tags

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'secondary', className = '' }) => {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)'
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-text)'
    },
    accent: {
      backgroundColor: 'var(--blue-light, #F0F6FD)',
      color: 'var(--blue-deep, #1A3E6D)'
    }
  };

  return (
    <span
      className={`badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.2rem 0.65rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.02em',
        ...styles[variant]
      }}
    >
      {children}
    </span>
  );
};

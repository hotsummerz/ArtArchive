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
      color: 'var(--color-white)',
      borderColor: 'var(--color-primary)'
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-text)',
      borderColor: 'var(--color-secondary)'
    },
    accent: {
      backgroundColor: 'var(--blue-light, #F0F6FD)',
      color: 'var(--blue-deep, #1A3E6D)',
      borderColor: 'var(--blue-border-glt, #BED8F6)'
    }
  };

  return (
    <span
      className={`badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '5px 12px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        border: '1px solid',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        ...styles[variant]
      }}
    >
      {children}
    </span>
  );
};

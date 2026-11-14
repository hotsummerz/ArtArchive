// ponytail: consistent editorial page header component

import React from 'react';

interface PageHeaderProps {
  label?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ label, title, description, action }) => {
  return (
    <header className="section-header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          {label && <p className="section-label">{label}</p>}
          <h1 className="section-title">{title}</h1>
          {description && <p className="section-description">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
};

// ponytail: nested routing layout for personal collections section

import React from 'react';
import { Outlet } from 'react-router-dom';

export const CollectionsLayout: React.FC = () => {
  return (
    <div className="collections-layout" style={{ paddingTop: 'var(--space-10)' }}>
      <Outlet />
    </div>
  );
};

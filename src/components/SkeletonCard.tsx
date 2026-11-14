// ponytail: loading placeholder preserving artwork card aspect ratio

import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-card__image" />
      <div className="skeleton skeleton-card__title" />
      <div className="skeleton skeleton-card__artist" />
    </div>
  );
};

// ponytail: responsive artwork grid supporting skeleton state and empty fallback

import React from 'react';
import { ArtworkSummary } from '../types';
import { ArtworkCard } from './ArtworkCard';
import { EmptyState } from './EmptyState';
import { SkeletonCard } from './SkeletonCard';

interface ArtworkGridProps {
  artworks?: ArtworkSummary[];
  loading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  actionText?: string;
  actionLink?: string;
  skeletonCount?: number;
}

export const ArtworkGrid: React.FC<ArtworkGridProps> = ({
  artworks = [],
  loading = false,
  emptyTitle,
  emptyMessage,
  actionText,
  actionLink,
  skeletonCount = 8
}) => {
  if (loading) {
    return (
      <div className="artwork-grid" aria-busy="true" aria-label="Memuat karya seni">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={`skel-${i}`} />
        ))}
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionText={actionText}
        actionLink={actionLink}
      />
    );
  }

  return (
    <div className="artwork-grid">
      {artworks.map(artwork => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
};

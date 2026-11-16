import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArtworkSummary } from '../types';
import { createPlaceholderImageUrl, getArtworkImageUrl } from '../utils/image';
import { FavoriteButton } from './FavoriteButton';

interface ArtworkCardProps {
  artwork: ArtworkSummary;
  showFavoriteButton?: boolean;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, showFavoriteButton = true }) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = imgError
    ? createPlaceholderImageUrl(artwork.title)
    : getArtworkImageUrl(artwork.imageId, artwork.imageUrl, 400);

  return (
    <article className="artwork-card">
      <div className="artwork-card__frame">
        <Link to={`/artwork/${artwork.id}`} tabIndex={-1} aria-hidden="true">
          <img
            src={imageUrl}
            alt={`${artwork.title} oleh ${artwork.artist}`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="artwork-card__image"
          />
        </Link>
        {showFavoriteButton && <FavoriteButton artwork={artwork} />}
      </div>
      <div className="artwork-card__info">
        <h3 className="artwork-card__title">
          <Link to={`/artwork/${artwork.id}`}>{artwork.title}</Link>
        </h3>
        <p className="artwork-card__artist">{artwork.artist}</p>
        <p className="artwork-card__meta">
          {artwork.date} {artwork.style ? `· ${artwork.style}` : ''}
        </p>
      </div>
    </article>
  );
};

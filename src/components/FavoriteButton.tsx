import { Heart } from 'lucide-react';
import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { ArtworkSummary } from '../types';

interface FavoriteButtonProps {
  artwork: ArtworkSummary;
  className?: string;
  size?: number;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ artwork, className = '', size = 18 }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(artwork.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if inside a Link
    e.stopPropagation();
    toggleFavorite(artwork);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`artwork-card__favorite-btn ${active ? 'active' : ''} ${className}`}
      aria-label={active ? `Hapus "${artwork.title}" dari favorit` : `Simpan "${artwork.title}" ke favorit`}
      aria-pressed={active}
    >
      <Heart
        size={size}
        fill={active ? 'var(--color-error)' : 'none'}
        stroke={active ? 'var(--color-error)' : 'currentColor'}
      />
    </button>
  );
};

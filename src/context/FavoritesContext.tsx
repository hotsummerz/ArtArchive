import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { STORAGE_KEYS } from '../config';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ArtworkSummary } from '../types';
import { useToast } from './ToastContext';

interface FavoritesContextType {
  favorites: ArtworkSummary[];
  isFavorite: (id: string | number) => boolean;
  addFavorite: (artwork: ArtworkSummary) => void;
  removeFavorite: (id: string | number) => void;
  toggleFavorite: (artwork: ArtworkSummary) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage<ArtworkSummary[]>(STORAGE_KEYS.favorites, []);
  const { showToast } = useToast();

  const isFavorite = useCallback(
    (id: string | number) => {
      const idStr = String(id);
      return favorites.some(item => String(item.id) === idStr);
    },
    [favorites]
  );

  const addFavorite = useCallback(
    (artwork: ArtworkSummary) => {
      const idStr = String(artwork.id);
      setFavorites(prev => {
        if (prev.some(item => String(item.id) === idStr)) return prev;
        return [artwork, ...prev];
      });
      showToast(`"${artwork.title}" ditambahkan ke favorit.`, 'success');
    },
    [setFavorites, showToast]
  );

  const removeFavorite = useCallback(
    (id: string | number) => {
      const idStr = String(id);
      const target = favorites.find(item => String(item.id) === idStr);
      setFavorites(prev => prev.filter(item => String(item.id) !== idStr));
      if (target) {
        showToast(`"${target.title}" dihapus dari favorit.`, 'info');
      }
    },
    [favorites, setFavorites, showToast]
  );

  const toggleFavorite = useCallback(
    (artwork: ArtworkSummary) => {
      if (isFavorite(artwork.id)) {
        removeFavorite(artwork.id);
      } else {
        addFavorite(artwork);
      }
    },
    [isFavorite, removeFavorite, addFavorite]
  );

  const value = useMemo(
    () => ({ favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite }),
    [favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

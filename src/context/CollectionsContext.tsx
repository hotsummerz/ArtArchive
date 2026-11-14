// ponytail: collections context managing personal curation collections

import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { STORAGE_KEYS } from '../config';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ArtworkSummary, Collection } from '../types';
import { useToast } from './ToastContext';

interface CollectionsContextType {
  collections: Collection[];
  createCollection: (name: string, description?: string) => Collection;
  updateCollection: (id: string, name: string, description?: string) => void;
  deleteCollection: (id: string) => void;
  addArtworkToCollection: (collectionId: string, artwork: ArtworkSummary) => boolean;
  removeArtworkFromCollection: (collectionId: string, artworkId: string | number) => void;
  getCollectionById: (id: string) => Collection | undefined;
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

export const CollectionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collections, setCollections] = useLocalStorage<Collection[]>(STORAGE_KEYS.collections, []);
  const { showToast } = useToast();

  const getCollectionById = useCallback(
    (id: string) => collections.find(c => c.id === id),
    [collections]
  );

  const createCollection = useCallback(
    (name: string, description = ''): Collection => {
      const newCollection: Collection = {
        id: crypto.randomUUID ? crypto.randomUUID() : `col-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        description: description.trim(),
        items: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      setCollections(prev => [newCollection, ...prev]);
      showToast(`Koleksi "${newCollection.name}" berhasil dibuat.`, 'success');
      return newCollection;
    },
    [setCollections, showToast]
  );

  const updateCollection = useCallback(
    (id: string, name: string, description = '') => {
      setCollections(prev =>
        prev.map(c => {
          if (c.id !== id) return c;
          return {
            ...c,
            name: name.trim(),
            description: description.trim(),
            updatedAt: Date.now()
          };
        })
      );
      showToast('Koleksi berhasil diperbarui.', 'success');
    },
    [setCollections, showToast]
  );

  const deleteCollection = useCallback(
    (id: string) => {
      const target = collections.find(c => c.id === id);
      setCollections(prev => prev.filter(c => c.id !== id));
      if (target) {
        showToast(`Koleksi "${target.name}" telah dihapus.`, 'info');
      }
    },
    [collections, setCollections, showToast]
  );

  const addArtworkToCollection = useCallback(
    (collectionId: string, artwork: ArtworkSummary): boolean => {
      let added = false;
      const artworkIdStr = String(artwork.id);

      setCollections(prev =>
        prev.map(c => {
          if (c.id !== collectionId) return c;
          if (c.items.some(item => String(item.id) === artworkIdStr)) {
            showToast(`Karya sudah ada di koleksi "${c.name}".`, 'info');
            return c;
          }
          added = true;
          return {
            ...c,
            items: [artwork, ...c.items],
            updatedAt: Date.now()
          };
        })
      );

      if (added) {
        const targetCol = collections.find(c => c.id === collectionId);
        showToast(`Karya ditambahkan ke koleksi "${targetCol?.name || 'Koleksi'}".`, 'success');
      }
      return added;
    },
    [collections, setCollections, showToast]
  );

  const removeArtworkFromCollection = useCallback(
    (collectionId: string, artworkId: string | number) => {
      const artworkIdStr = String(artworkId);
      setCollections(prev =>
        prev.map(c => {
          if (c.id !== collectionId) return c;
          return {
            ...c,
            items: c.items.filter(item => String(item.id) !== artworkIdStr),
            updatedAt: Date.now()
          };
        })
      );
      showToast('Karya dihapus dari koleksi.', 'info');
    },
    [setCollections, showToast]
  );

  const value = useMemo(
    () => ({
      collections,
      createCollection,
      updateCollection,
      deleteCollection,
      addArtworkToCollection,
      removeArtworkFromCollection,
      getCollectionById
    }),
    [
      collections,
      createCollection,
      updateCollection,
      deleteCollection,
      addArtworkToCollection,
      removeArtworkFromCollection,
      getCollectionById
    ]
  );

  return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
};

export function useCollections(): CollectionsContextType {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
}

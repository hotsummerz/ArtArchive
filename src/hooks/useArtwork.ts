// ponytail: server state hook for artwork detail by ID

import { useCallback, useEffect, useState } from 'react';
import { getArtworkById } from '../services/artworkService';
import { Artwork } from '../types';

interface UseArtworkReturn {
  artwork: Artwork | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useArtwork(id?: string | number): UseArtworkReturn {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const refetch = useCallback(() => {
    setReloadIndex(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!id) {
      setArtwork(null);
      setLoading(false);
      setError('ID karya seni tidak valid.');
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getArtworkById(id, controller.signal)
      .then(result => {
        setArtwork(result);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Gagal memuat detail karya seni.');
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [id, reloadIndex]);

  return { artwork, loading, error, refetch };
}

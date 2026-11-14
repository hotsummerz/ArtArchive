// ponytail: server state hook for gallery artworks search & pagination with AbortController cancellation

import { useCallback, useEffect, useState } from 'react';
import { searchArtworks } from '../services/artworkService';
import { ArtworkSearchResult, FilterParams } from '../types';

interface UseArtworksReturn {
  data: ArtworkSearchResult | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isEmpty: boolean;
}

export function useArtworks(params: FilterParams): UseArtworksReturn {
  const [data, setData] = useState<ArtworkSearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const refetch = useCallback(() => {
    setReloadIndex(prev => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    searchArtworks(params, controller.signal)
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Request was cancelled, ignore
          return;
        }
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data karya seni.');
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [params.q, params.style, params.sort, params.page, reloadIndex]);

  const isEmpty = !loading && !error && (!data || data.items.length === 0);

  return { data, loading, error, refetch, isEmpty };
}

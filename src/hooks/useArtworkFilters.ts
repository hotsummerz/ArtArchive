// ponytail: URL query parameter synchronization hook for gallery search & filters

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterParams, SortOption } from '../types';

export function useArtworkFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: FilterParams = useMemo(() => {
    const q = searchParams.get('q') || '';
    const style = searchParams.get('style') || '';
    const sort = (searchParams.get('sort') as SortOption) || 'relevance';
    const page = parseInt(searchParams.get('page') || '1', 10);

    return {
      q,
      style,
      sort,
      page: isNaN(page) || page < 1 ? 1 : page
    };
  }, [searchParams]);

  const updateFilters = useCallback(
    (updates: Partial<FilterParams>) => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);

        if (updates.q !== undefined) {
          const trimmed = updates.q.trim();
          if (trimmed) next.set('q', trimmed);
          else next.delete('q');
        }

        if (updates.style !== undefined) {
          if (updates.style && updates.style !== 'Semua Aliran') {
            next.set('style', updates.style);
          } else {
            next.delete('style');
          }
        }

        if (updates.sort !== undefined) {
          if (updates.sort && updates.sort !== 'relevance') {
            next.set('sort', updates.sort);
          } else {
            next.delete('sort');
          }
        }

        // If search, style, or sort changed and page wasn't explicitly given, reset page to 1
        if (
          (updates.q !== undefined || updates.style !== undefined || updates.sort !== undefined) &&
          updates.page === undefined
        ) {
          next.delete('page');
        } else if (updates.page !== undefined) {
          if (updates.page > 1) {
            next.set('page', String(updates.page));
          } else {
            next.delete('page');
          }
        }

        return next;
      });
    },
    [setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { filters, updateFilters, resetFilters };
}

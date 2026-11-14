// ponytail: homepage combining editorial hero, URL-synced search/filter gallery, and pagination

import { ArrowDown } from 'lucide-react';
import React, { useRef } from 'react';
import { ArtworkGrid } from '../components/ArtworkGrid';
import { ErrorState } from '../components/ErrorState';
import { Pagination } from '../components/Pagination';
import { SearchBar } from '../components/SearchBar';
import { SortSelect } from '../components/SortSelect';
import { useArtworkFilters } from '../hooks/useArtworkFilters';
import { useArtworks } from '../hooks/useArtworks';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const HomePage: React.FC = () => {
  useDocumentTitle('Jelajah Koleksi Seni Rupa');
  const galleryRef = useRef<HTMLElement>(null);
  const { filters, updateFilters } = useArtworkFilters();
  const { data, loading, error, refetch } = useArtworks(filters);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" aria-label="Pengenalan Art Archive">
        <div className="hero__content">
          <h1 className="hero__title">
            Discover the stories behind the world&apos;s greatest artworks.
          </h1>
          <p className="hero__lead">
            Sebuah arsip digital kuratorial untuk menjelajahi lukisan agung dari seniman legendaris, periode bersejarah, dan aliran seni rupa dunia. Simpan karya favorit dan bangun koleksi pribadi Anda.
          </p>
          <div className="hero__actions">
            <button type="button" onClick={scrollToGallery} className="btn btn--primary">
              <span>Jelajahi Koleksi</span>
              <ArrowDown size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section ref={galleryRef} id="gallery" aria-label="Galeri lukisan">
        <div className="gallery-controls">
          <div className="gallery-controls__top">
            <SearchBar
              value={filters.q || ''}
              onChange={q => updateFilters({ q })}
              placeholder="Cari lukisan berdasarkan judul atau nama seniman..."
            />
            <SortSelect
              value={filters.sort}
              onChange={sort => updateFilters({ sort })}
            />
          </div>
        </div>

        {error ? (
          <ErrorState
            title="Gagal Memuat Galeri Lukisan"
            message={error}
            onRetry={refetch}
          />
        ) : (
          <>
            <ArtworkGrid
              artworks={data?.items || []}
              loading={loading}
              emptyTitle="Tidak Ada Lukisan Ditemukan"
              emptyMessage={
                filters.q
                  ? `Tidak ada lukisan yang cocok dengan kata kunci "${filters.q}".`
                  : 'Saat ini belum ada lukisan yang dapat ditampilkan.'
              }
            />

            {!loading && data && data.totalPages > 1 && (
              <Pagination
                currentPage={data.currentPage}
                totalPages={data.totalPages}
                onPageChange={page => updateFilters({ page })}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
};

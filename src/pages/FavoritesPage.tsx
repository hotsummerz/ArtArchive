// ponytail: favorites view presenting user's saved artworks

import React from 'react';
import { ArtworkGrid } from '../components/ArtworkGrid';
import { PageHeader } from '../components/PageHeader';
import { useFavorites } from '../context/FavoritesContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const FavoritesPage: React.FC = () => {
  useDocumentTitle('Karya Seni Favorit');
  const { favorites } = useFavorites();

  return (
    <div style={{ paddingTop: 'var(--space-10)' }}>
      <PageHeader
        title="Karya Seni Favorit"
        description={
          favorites.length > 0
            ? `Menampilkan ${favorites.length} lukisan yang Anda simpan sebagai favorit pribadi.`
            : 'Simpan lukisan yang menginspirasi untuk diakses kembali kapan saja.'
        }
      />

      <ArtworkGrid
        artworks={favorites}
        emptyTitle="Belum Ada Karya Favorit"
        emptyMessage="Jelajahi galeri kami dan klik ikon hati pada karya seni yang Anda sukai untuk menyimpannya di sini."
        actionText="Mulai Jelajahi Galeri"
        actionLink="/"
      />
    </div>
  );
};

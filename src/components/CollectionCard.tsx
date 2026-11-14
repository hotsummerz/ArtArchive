// ponytail: curated collection card preview with thumbnail strip

import { Folder, Trash2 } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Collection } from '../types';
import { createPlaceholderImageUrl, getArtworkImageUrl } from '../utils/image';

interface CollectionCardProps {
  collection: Collection;
  onDeleteRequest?: (collection: Collection) => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection, onDeleteRequest }) => {
  const previewItems = collection.items.slice(0, 3);

  return (
    <article className="collection-card">
      <div className="collection-card__header">
        <h3 className="collection-card__title">
          <Link to={`/collections/${collection.id}`}>{collection.name}</Link>
        </h3>
        {onDeleteRequest && (
          <button
            type="button"
            onClick={() => onDeleteRequest(collection)}
            className="btn btn--danger btn--sm"
            aria-label={`Hapus koleksi ${collection.name}`}
            title="Hapus koleksi"
            style={{ padding: '0.35rem 0.6rem' }}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <p className="collection-card__desc">
        {collection.description || 'Tidak ada deskripsi kuratorial untuk koleksi ini.'}
      </p>

      {/* 3-thumbnail preview strip */}
      <div className="collection-card__previews" aria-hidden="true">
        {previewItems.length > 0 ? (
          previewItems.map((item, idx) => (
            <img
              key={`${item.id}-${idx}`}
              src={getArtworkImageUrl(item.imageId, item.imageUrl, 200)}
              alt=""
              onError={e => {
                (e.target as HTMLImageElement).src = createPlaceholderImageUrl();
              }}
              className="collection-card__thumb"
            />
          ))
        ) : (
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-muted)',
              fontSize: '0.8rem',
              gap: 'var(--space-2)'
            }}
          >
            <Folder size={16} />
            <span>Belum ada karya tersimpan</span>
          </div>
        )}
      </div>

      <div className="collection-card__footer">
        <span>{collection.items.length} karya seni</span>
        <Link to={`/collections/${collection.id}`} className="btn btn--secondary btn--sm">
          Buka Koleksi &rarr;
        </Link>
      </div>
    </article>
  );
};

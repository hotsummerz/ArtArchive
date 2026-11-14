// ponytail: collection detail view displaying curatorial artworks with item removal & editing

import { ArrowLeft, Edit2, Info, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArtworkCard } from '../components/ArtworkCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { useCollections } from '../context/CollectionsContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { validateCollectionDescription, validateCollectionName } from '../utils/validators';

export const CollectionDetailPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const { collections, getCollectionById, updateCollection, deleteCollection, removeArtworkFromCollection } = useCollections();

  const collection = collectionId ? getCollectionById(collectionId) : undefined;
  useDocumentTitle(collection ? `Koleksi: ${collection.name}` : 'Koleksi Tidak Ditemukan');

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(collection?.name || '');
  const [editDesc, setEditDesc] = useState(collection?.description || '');
  const [editNameError, setEditNameError] = useState<string | null>(null);
  const [editDescError, setEditDescError] = useState<string | null>(null);

  const [isDeleteColDialogOpen, setIsDeleteColDialogOpen] = useState(false);
  const [artworkToRemoveId, setArtworkToRemoveId] = useState<string | number | null>(null);

  if (!collection) {
    return (
      <div style={{ padding: 'var(--space-12) 0' }}>
        <Link to="/collections" className="btn btn--ghost btn--sm" style={{ marginBottom: 'var(--space-6)' }}>
          <ArrowLeft size={16} />
          <span>Kembali ke Koleksi</span>
        </Link>
        <EmptyState
          title="Koleksi Tidak Ditemukan"
          message="Koleksi kurasi dengan ID tersebut tidak ditemukan atau mungkin sudah dihapus."
          actionText="Lihat Semua Koleksi"
          actionLink="/collections"
        />
      </div>
    );
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otherNames = collections.filter(c => c.id !== collection.id).map(c => c.name);
    const nErr = validateCollectionName(editName, otherNames, collection.id, collections);
    const dErr = validateCollectionDescription(editDesc);

    setEditNameError(nErr);
    setEditDescError(dErr);

    if (nErr || dErr) return;

    updateCollection(collection.id, editName, editDesc);
    setIsEditing(false);
  };

  const handleConfirmDeleteCollection = () => {
    deleteCollection(collection.id);
    navigate('/collections');
  };

  const handleConfirmRemoveArtwork = () => {
    if (artworkToRemoveId !== null) {
      removeArtworkFromCollection(collection.id, artworkToRemoveId);
      setArtworkToRemoveId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link to="/collections" className="btn btn--ghost btn--sm">
          <ArrowLeft size={16} />
          <span>Kembali ke Daftar Koleksi</span>
        </Link>
      </div>

      {isEditing ? (
        <section
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-8)',
            marginBottom: 'var(--space-8)',
            maxWidth: '640px'
          }}
          aria-label="Edit informasi koleksi"
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 500, marginBottom: 'var(--space-4)' }}>
            Ubah Informasi Koleksi
          </h2>
          <form onSubmit={handleEditSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="edit-col-name" className="form-label">Nama Koleksi</label>
              <input
                id="edit-col-name"
                type="text"
                value={editName}
                maxLength={40}
                onChange={e => {
                  setEditName(e.target.value);
                  if (editNameError) setEditNameError(null);
                }}
                className="form-input"
                aria-invalid={!!editNameError}
              />
              {editNameError && (
                <span className="form-error" role="alert">
                  <Info size={14} />
                  {editNameError}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="edit-col-desc" className="form-label">Deskripsi Kuratorial</label>
              <textarea
                id="edit-col-desc"
                rows={3}
                value={editDesc}
                maxLength={200}
                onChange={e => {
                  setEditDesc(e.target.value);
                  if (editDescError) setEditDescError(null);
                }}
                className="form-textarea"
                aria-invalid={!!editDescError}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {editDescError ? (
                  <span className="form-error" role="alert">
                    <Info size={14} />
                    {editDescError}
                  </span>
                ) : <span />}
                <span className="char-counter">{editDesc.length} / 200</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditName(collection.name);
                  setEditDesc(collection.description);
                }}
                className="btn btn--ghost"
              >
                Batal
              </button>
              <button type="submit" className="btn btn--primary">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </section>
      ) : (
        <PageHeader
          label={`Koleksi Pribadi · ${collection.items.length} Karya`}
          title={collection.name}
          description={collection.description || 'Tidak ada deskripsi kuratorial untuk koleksi ini.'}
          action={
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                type="button"
                onClick={() => {
                  setEditName(collection.name);
                  setEditDesc(collection.description);
                  setIsEditing(true);
                }}
                className="btn btn--secondary btn--sm"
                aria-label="Ubah koleksi ini"
              >
                <Edit2 size={15} />
                <span>Ubah</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteColDialogOpen(true)}
                className="btn btn--danger btn--sm"
                aria-label="Hapus koleksi ini"
              >
                <Trash2 size={15} />
                <span>Hapus Koleksi</span>
              </button>
            </div>
          }
        />
      )}

      {/* Artworks inside this collection */}
      {collection.items.length === 0 ? (
        <EmptyState
          title="Koleksi Ini Masih Kosong"
          message="Kamu belum menambahkan lukisan ke koleksi ini. Jelajahi galeri dan pilih 'Tambah ke Koleksi' pada halaman karya."
          actionText="Jelajahi Galeri"
          actionLink="/"
        />
      ) : (
        <div className="artwork-grid">
          {collection.items.map(artwork => (
            <div key={artwork.id} style={{ position: 'relative' }}>
              <ArtworkCard artwork={artwork} />
              <button
                type="button"
                onClick={() => setArtworkToRemoveId(artwork.id)}
                className="btn btn--danger btn--sm"
                style={{
                  position: 'absolute',
                  top: 'var(--space-3)',
                  left: 'var(--space-3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(4px)',
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.75rem',
                  zIndex: 3
                }}
                aria-label={`Lepas "${artwork.title}" dari koleksi ini`}
                title="Lepas dari koleksi ini"
              >
                <Trash2 size={13} />
                <span>Lepas</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Whole Collection */}
      <ConfirmDialog
        isOpen={isDeleteColDialogOpen}
        title="Hapus Koleksi?"
        message={`Apakah Anda yakin ingin menghapus koleksi "${collection.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Koleksi"
        cancelText="Batal"
        danger={true}
        onConfirm={handleConfirmDeleteCollection}
        onCancel={() => setIsDeleteColDialogOpen(false)}
      />

      {/* Confirm Remove Single Artwork from Collection */}
      <ConfirmDialog
        isOpen={artworkToRemoveId !== null}
        title="Lepas Karya dari Koleksi?"
        message="Apakah Anda yakin ingin melepas karya ini dari koleksi? Karya tidak akan terhapus dari arsip utama atau favorit Anda."
        confirmText="Lepas Karya"
        cancelText="Batal"
        danger={true}
        onConfirm={handleConfirmRemoveArtwork}
        onCancel={() => setArtworkToRemoveId(null)}
      />
    </div>
  );
};

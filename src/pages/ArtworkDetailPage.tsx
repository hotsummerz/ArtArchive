// ponytail: artwork detail page with curated museum presentation, favorites, collection modal, and note editor

import { ArrowLeft, BookmarkPlus, Edit3, Heart, Info, Save, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AddToCollectionModal } from '../components/AddToCollectionModal';
import { Badge } from '../components/Badge';
import { ErrorState } from '../components/ErrorState';
import { useFavorites } from '../context/FavoritesContext';
import { useNotes } from '../context/NotesContext';
import { useArtwork } from '../hooks/useArtwork';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { createPlaceholderImageUrl, getArtworkImageUrl } from '../utils/image';
import { validateNoteText } from '../utils/validators';

export const ArtworkDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { artwork, loading, error, refetch } = useArtwork(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getNote, saveNote, deleteNote } = useNotes();

  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Form State: Personal Artwork Note
  const existingNote = id ? getNote(id) : undefined;
  const [isEditingNote, setIsEditingNote] = useState(!existingNote);
  const [noteInput, setNoteInput] = useState(existingNote?.text || '');
  const [noteError, setNoteError] = useState<string | null>(null);

  useDocumentTitle(artwork ? `${artwork.title} (${artwork.artist})` : 'Detail Karya Seni');

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-12) 0' }}>
        <div className="skeleton" style={{ width: '140px', height: '2rem', marginBottom: 'var(--space-8)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-10)' }}>
          <div className="skeleton" style={{ width: '100%', height: '520px', borderRadius: 'var(--radius-lg)' }} />
          <div>
            <div className="skeleton" style={{ width: '70%', height: '3rem', marginBottom: 'var(--space-4)' }} />
            <div className="skeleton" style={{ width: '40%', height: '1.5rem', marginBottom: 'var(--space-8)' }} />
            <div className="skeleton" style={{ width: '100%', height: '180px', borderRadius: 'var(--radius-md)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div style={{ padding: 'var(--space-12) 0' }}>
        <Link to="/" className="btn btn--ghost btn--sm" style={{ marginBottom: 'var(--space-6)', borderColor: 'transparent' }}>
          <ArrowLeft size={16} />
          <span>Kembali ke Galeri</span>
        </Link>
        <ErrorState
          title="Karya Seni Tidak Ditemukan"
          message={error || 'Data karya seni untuk ID tersebut tidak tersedia di arsip digital.'}
          onRetry={refetch}
        />
      </div>
    );
  }

  const isFav = isFavorite(artwork.id);
  const imageUrl = imgError
    ? createPlaceholderImageUrl(artwork.title)
    : getArtworkImageUrl(artwork.imageId, artwork.imageUrl, 843);

  // Handle Note Submission & Validation
  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateNoteText(noteInput);
    if (validationError) {
      setNoteError(validationError);
      return;
    }
    setNoteError(null);
    if (id) {
      saveNote(id, noteInput);
      setIsEditingNote(false);
    }
  };

  const handleNoteDelete = () => {
    if (id) {
      deleteNote(id);
      setNoteInput('');
      setIsEditingNote(true);
      setNoteError(null);
    }
  };

  return (
    <article className="artwork-detail-page">
      <div style={{ marginBottom: 'var(--space-6)', paddingTop: 'var(--space-6)' }}>
        <Link to="/" className="btn btn--ghost btn--sm" style={{ borderColor: 'transparent' }}>
          <ArrowLeft size={16} />
          <span>Kembali ke Galeri</span>
        </Link>
      </div>

      <div className="artwork-detail">
        {/* Left: Large Artwork Viewer */}
        <div className="artwork-detail__viewer">
          <img
            src={imageUrl}
            alt={`${artwork.title} oleh ${artwork.artist}`}
            onError={() => setImgError(true)}
            className="artwork-detail__image"
          />
        </div>

        {/* Right: Curatorial Information & Actions */}
        <div className="artwork-detail__info">
          {artwork.style && (
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <Badge variant="accent">{artwork.style}</Badge>
            </div>
          )}

          <h1 className="artwork-detail__title">{artwork.title}</h1>
          <p className="artwork-detail__artist">
            {artwork.artist}
            {artwork.artistBio && (
              <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                {artwork.artistBio}
              </span>
            )}
          </p>

          {/* Action Buttons */}
          <div className="artwork-detail__actions">
            <button
              type="button"
              onClick={() => toggleFavorite(artwork)}
              className={`btn ${isFav ? 'btn--secondary' : 'btn--primary'}`}
              aria-pressed={isFav}
            >
              <Heart size={16} fill={isFav ? 'var(--color-error)' : 'none'} color={isFav ? 'var(--color-error)' : 'currentColor'} />
              <span>{isFav ? 'Tersimpan di Favorit' : 'Simpan ke Favorit'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCollectionModalOpen(true)}
              className="btn btn--ghost"
            >
              <BookmarkPlus size={16} />
              <span>Tambah ke Koleksi</span>
            </button>
          </div>

          {/* Curatorial Metadata Grid */}
          <div className="artwork-detail__meta-grid">
            <div className="artwork-detail__meta-item">
              <span className="artwork-detail__meta-label">Tahun Pembuatan</span>
              <span className="artwork-detail__meta-val">{artwork.date || '—'}</span>
            </div>
            <div className="artwork-detail__meta-item">
              <span className="artwork-detail__meta-label">Medium &amp; Teknik</span>
              <span className="artwork-detail__meta-val">{artwork.medium || '—'}</span>
            </div>
            {artwork.dimensions && (
              <div className="artwork-detail__meta-item">
                <span className="artwork-detail__meta-label">Dimensi Karya</span>
                <span className="artwork-detail__meta-val">{artwork.dimensions}</span>
              </div>
            )}
            {artwork.origin && (
              <div className="artwork-detail__meta-item">
                <span className="artwork-detail__meta-label">Asal / Budaya</span>
                <span className="artwork-detail__meta-val">{artwork.origin}</span>
              </div>
            )}
            <div className="artwork-detail__meta-item">
              <span className="artwork-detail__meta-label">Hak Cipta</span>
              <span className="artwork-detail__meta-val">
                {artwork.isPublicDomain ? 'Public Domain (Domain Publik)' : 'Hak Cipta Dilindungi'}
              </span>
            </div>
            {artwork.creditLine && (
              <div className="artwork-detail__meta-item" style={{ gridColumn: '1 / -1' }}>
                <span className="artwork-detail__meta-label">Kredit Koleksi</span>
                <span className="artwork-detail__meta-val" style={{ fontSize: '0.85rem' }}>
                  {artwork.creditLine}
                </span>
              </div>
            )}
          </div>

          {/* Curatorial Description */}
          {artwork.description && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 500, marginBottom: 'var(--space-2)' }}>
                Ulasan Kuratorial
              </h2>
              <p className="artwork-detail__description">{artwork.description}</p>
            </div>
          )}

          {/* Form: Personal Notes (Controlled Component with Validation) */}
          <section className="artwork-notes" aria-label="Catatan pribadi">
            <div className="artwork-notes__header">
              <h2 className="artwork-notes__title">Catatan Pribadi</h2>
              {existingNote && !isEditingNote && (
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setNoteInput(existingNote.text);
                      setIsEditingNote(true);
                    }}
                    className="btn btn--ghost btn--sm"
                    aria-label="Edit catatan pribadi"
                  >
                    <Edit3 size={14} />
                    <span>Ubah</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNoteDelete}
                    className="btn btn--danger btn--sm"
                    aria-label="Hapus catatan pribadi"
                  >
                    <Trash2 size={14} />
                    <span>Hapus</span>
                  </button>
                </div>
              )}
            </div>

            {existingNote && !isEditingNote ? (
              <div>
                <p style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {existingNote.text}
                </p>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>
                  Terakhir diperbarui: {new Date(existingNote.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ) : (
              <form onSubmit={handleNoteSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="note-textarea" className="form-label">
                    Tulis interpretasi atau catatan pribadi tentang lukisan ini:
                  </label>
                  <textarea
                    id="note-textarea"
                    rows={4}
                    value={noteInput}
                    onChange={e => {
                      setNoteInput(e.target.value);
                      if (noteError) setNoteError(null);
                    }}
                    onBlur={() => {
                      if (noteInput) {
                        const err = validateNoteText(noteInput);
                        setNoteError(err);
                      }
                    }}
                    maxLength={1000}
                    placeholder="Contoh: Lukisan ini memiliki komposisi pencahayaan yang sangat lembut pada sudut kanan atas..."
                    className="form-textarea"
                    aria-invalid={!!noteError}
                    aria-describedby={noteError ? 'note-error' : undefined}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {noteError ? (
                      <span id="note-error" className="form-error" role="alert">
                        <Info size={14} />
                        {noteError}
                      </span>
                    ) : <span />}
                    <span className="char-counter">{noteInput.length} / 1000</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', marginTop: 'var(--space-3)' }}>
                  {existingNote && (
                    <button
                      type="button"
                      onClick={() => {
                        setNoteInput(existingNote.text);
                        setIsEditingNote(false);
                        setNoteError(null);
                      }}
                      className="btn btn--ghost btn--sm"
                    >
                      Batal
                    </button>
                  )}
                  <button type="submit" className="btn btn--primary btn--sm">
                    <Save size={14} />
                    <span>Simpan Catatan</span>
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>

      {/* Add to Collection Modal */}
      <AddToCollectionModal
        artwork={artwork}
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
      />
    </article>
  );
};

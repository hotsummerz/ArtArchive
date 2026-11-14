// ponytail: personal collections manager with creation form, validation, and confirmation dialog

import { FolderPlus, Info, Plus } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { CollectionCard } from '../components/CollectionCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { useCollections } from '../context/CollectionsContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Collection } from '../types';
import { validateCollectionDescription, validateCollectionName } from '../utils/validators';

export const CollectionsPage: React.FC = () => {
  useDocumentTitle('Koleksi Pribadi');
  const { collections, createCollection, deleteCollection } = useCollections();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);

  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleOpenForm = () => {
    setIsFormVisible(true);
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingNames = collections.map(c => c.name);
    const nErr = validateCollectionName(name, existingNames);
    const dErr = validateCollectionDescription(description);

    setNameError(nErr);
    setDescError(dErr);

    if (nErr) {
      nameInputRef.current?.focus();
      return;
    }
    if (dErr) return;

    createCollection(name, description);
    setName('');
    setDescription('');
    setNameError(null);
    setDescError(null);
    setIsFormVisible(false);
  };

  const handleConfirmDelete = () => {
    if (collectionToDelete) {
      deleteCollection(collectionToDelete.id);
      setCollectionToDelete(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Koleksi Pribadi"
        description="Kelompokkan karya seni berdasarkan tema, periode, atau preferensi estetika sesuai selera."
        action={
          !isFormVisible && (
            <button type="button" onClick={handleOpenForm} className="btn btn--primary">
              <Plus size={16} />
              <span>Buat Koleksi Baru</span>
            </button>
          )
        }
      />

      {/* Collection Creation Form */}
      {isFormVisible && (
        <section
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-8)',
            marginBottom: 'var(--space-10)',
            maxWidth: '640px'
          }}
          aria-label="Formulir pembuatan koleksi baru"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <FolderPlus size={22} color="var(--color-primary)" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 500 }}>
              Buat Koleksi Baru
            </h2>
          </div>

          <form onSubmit={handleFormSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="col-name" className="form-label">
                Nama Koleksi <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <input
                ref={nameInputRef}
                id="col-name"
                type="text"
                value={name}
                maxLength={40}
                onChange={e => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                onBlur={() => {
                  if (name) {
                    const err = validateCollectionName(name, collections.map(c => c.name));
                    setNameError(err);
                  }
                }}
                placeholder="Misal: Mahakarya Renaisans, Impresionisme Prancis"
                className="form-input"
                aria-invalid={!!nameError}
                aria-describedby={nameError ? 'col-name-error' : undefined}
                required
              />
              {nameError && (
                <span id="col-name-error" className="form-error" role="alert">
                  <Info size={14} />
                  {nameError}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="col-desc" className="form-label">
                Deskripsi Kuratorial (Opsional)
              </label>
              <textarea
                id="col-desc"
                rows={3}
                value={description}
                maxLength={200}
                onChange={e => {
                  setDescription(e.target.value);
                  if (descError) setDescError(null);
                }}
                onBlur={() => {
                  const err = validateCollectionDescription(description);
                  setDescError(err);
                }}
                placeholder="Catatan pengantar tema atau konsep koleksi ini..."
                className="form-textarea"
                aria-invalid={!!descError}
                aria-describedby={descError ? 'col-desc-error' : undefined}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {descError ? (
                  <span id="col-desc-error" className="form-error" role="alert">
                    <Info size={14} />
                    {descError}
                  </span>
                ) : <span />}
                <span className="char-counter">{description.length} / 200</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
              <button
                type="button"
                onClick={() => {
                  setIsFormVisible(false);
                  setName('');
                  setDescription('');
                  setNameError(null);
                  setDescError(null);
                }}
                className="btn btn--ghost"
              >
                Batal
              </button>
              <button type="submit" className="btn btn--primary">
                Simpan Koleksi
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <EmptyState
          title="Belum Ada Koleksi Terbuat"
          message="Buat koleksi pertamamu untuk mulai mengelompokkan karya seni sesuai tema atau seniman favoritmu."
          actionText="Buat Koleksi Sekarang"
          onAction={handleOpenForm}
        />
      ) : (
        <div className="collections-grid">
          {collections.map(col => (
            <CollectionCard
              key={col.id}
              collection={col}
              onDeleteRequest={c => setCollectionToDelete(c)}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog for Deletion */}
      <ConfirmDialog
        isOpen={!!collectionToDelete}
        title="Hapus Koleksi?"
        message={`Apakah kamu yakin ingin menghapus koleksi "${collectionToDelete?.name || ''}"? Seluruh karya seni di dalam koleksi ini akan dilepas (karya favoritmu tetap aman).`}
        confirmText="Ya, Hapus Koleksi"
        cancelText="Batal"
        danger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCollectionToDelete(null)}
      />
    </div>
  );
};

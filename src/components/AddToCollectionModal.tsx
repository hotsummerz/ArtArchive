// ponytail: modal allowing artwork insertion into personal collections

import { FolderPlus, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCollections } from '../context/CollectionsContext';
import { ArtworkSummary } from '../types';

interface AddToCollectionModalProps {
  artwork: ArtworkSummary;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToCollectionModal: React.FC<AddToCollectionModalProps> = ({ artwork, isOpen, onClose }) => {
  const { collections, addArtworkToCollection } = useCollections();
  const [selectedColId, setSelectedColId] = useState<string>(collections[0]?.id || '');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedColId) return;
    addArtworkToCollection(selectedColId, artwork);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-col-title"
        className="modal-content"
      >
        <div className="modal-header">
          <h2 id="add-col-title" className="modal-title">
            Simpan ke Koleksi
          </h2>
          <button type="button" onClick={onClose} className="btn btn--icon" aria-label="Tutup modal">
            <X size={18} />
          </button>
        </div>

        {collections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
            <FolderPlus size={36} color="var(--color-primary)" style={{ margin: '0 auto var(--space-3)' }} />
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>
              Kamu belum memiliki koleksi pribadi. Buat koleksi pertamamu terlebih dahulu.
            </p>
            <Link to="/collections" onClick={onClose} className="btn btn--primary">
              <Plus size={16} />
              <span>Buat Koleksi Baru</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label htmlFor="collection-select" className="form-label">
                Pilih Koleksi Tujuan:
              </label>
              <select
                id="collection-select"
                value={selectedColId}
                onChange={e => setSelectedColId(e.target.value)}
                className="form-select"
              >
                {collections.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.items.length} karya)
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
              <button type="button" onClick={onClose} className="btn btn--ghost">
                Batal
              </button>
              <button type="submit" className="btn btn--primary" disabled={!selectedColId}>
                Simpan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

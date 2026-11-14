// ponytail: 404 page fallback with return CTA

import { Compass } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const NotFoundPage: React.FC = () => {
  useDocumentTitle('Halaman Tidak Ditemukan');

  return (
    <div className="state-box" style={{ padding: 'var(--space-20) var(--space-4)' }} role="region" aria-label="Halaman tidak ditemukan">
      <div className="state-box__icon">
        <Compass size={36} strokeWidth={1.5} />
      </div>
      <h1 className="state-box__title">404 — Halaman Tidak Ditemukan</h1>
      <p className="state-box__message">
        Halaman atau rute yang dituju tidak berada dalam arsip digital kami. Silakan kembali ke beranda untuk menjelajahi karya seni lainnya.
      </p>
      <Link to="/" className="btn btn--primary">
        Kembali ke Galeri Utama
      </Link>
    </div>
  );
};

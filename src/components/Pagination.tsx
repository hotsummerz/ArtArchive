// ponytail: pagination controls with aria-current support

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { getPaginationRange } from '../utils/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Navigasi halaman galeri">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="pagination__btn"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((p, idx) => {
        if (p === 'ellipsis') {
          return (
            <span key={`ellipsis-${idx}`} style={{ padding: '0 0.5rem', color: 'var(--color-text-muted)' }}>
              &hellip;
            </span>
          );
        }

        const isCurrent = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`pagination__btn ${isCurrent ? 'active' : ''}`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="pagination__btn"
        aria-label="Halaman berikutnya"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};

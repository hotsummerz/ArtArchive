// ponytail: sort dropdown component synchronized with URL query state

import { ArrowUpDown } from 'lucide-react';
import React from 'react';
import { SortOption } from '../types';

interface SortSelectProps {
  value?: SortOption;
  onChange: (sort: SortOption) => void;
}

export const SortSelect: React.FC<SortSelectProps> = ({ value = 'relevance', onChange }) => {
  return (
    <div className="sort-select">
      <label htmlFor="gallery-sort-select">
        <ArrowUpDown size={14} style={{ display: 'inline', marginRight: '4px' }} aria-hidden="true" />
        Urutkan:
      </label>
      <select
        id="gallery-sort-select"
        value={value}
        onChange={e => onChange(e.target.value as SortOption)}
        aria-label="Urutkan karya seni"
      >
        <option value="relevance">Relevansi</option>
        <option value="title-asc">Judul (A–Z)</option>
        <option value="title-desc">Judul (Z–A)</option>
        <option value="date-asc">Tahun Tertua</option>
        <option value="date-desc">Tahun Terbaru</option>
        <option value="artist-asc">Nama Seniman (A–Z)</option>
      </select>
    </div>
  );
};

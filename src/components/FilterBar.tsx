// ponytail: horizontal scrolling filter bar for art movements

import React from 'react';
import { ART_MOVEMENTS } from '../services/artworkService';

interface FilterBarProps {
  selectedStyle?: string;
  onSelectStyle: (style: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ selectedStyle = '', onSelectStyle }) => {
  const activeValue = selectedStyle || 'Semua Aliran';

  return (
    <nav className="filter-bar" aria-label="Filter aliran seni">
      {ART_MOVEMENTS.map(movement => {
        const isActive = activeValue === movement;
        return (
          <button
            key={movement}
            type="button"
            onClick={() => onSelectStyle(movement === 'Semua Aliran' ? '' : movement)}
            className={`filter-chip ${isActive ? 'active' : ''}`}
            aria-pressed={isActive}
          >
            {movement}
          </button>
        );
      })}
    </nav>
  );
};

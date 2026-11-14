// ponytail: controlled debounced search input with clear trigger

import { Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Cari judul lukisan atau nama seniman...'
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 400);

  // Sync external prop updates
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Emit debounced changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="search-bar" role="search">
      <Search size={18} className="search-bar__icon" aria-hidden="true" />
      <input
        type="search"
        value={localValue}
        maxLength={100}
        onChange={e => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="search-bar__input"
        aria-label="Pencarian lukisan"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="search-bar__clear"
          aria-label="Hapus kata kunci pencarian"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

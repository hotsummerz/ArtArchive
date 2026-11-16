import { Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const isClearingRef = useRef(false);

  // Sync external prop updates (e.g. navigation or URL reset)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced emit of local input changes
  useEffect(() => {
    if (isClearingRef.current) {
      isClearingRef.current = false;
      return;
    }

    if (localValue === value) {
      return;
    }

    const timer = setTimeout(() => {
      onChange(localValue);
    }, 400);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  const handleClear = () => {
    isClearingRef.current = true;
    setLocalValue('');
    onChange('');
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setLocalValue(nextVal);
    if (nextVal === '') {
      isClearingRef.current = true;
      onChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && localValue) {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <div className="search-bar" role="search">
      <Search size={18} className="search-bar__icon" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        value={localValue}
        maxLength={100}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
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
          title="Hapus pencarian"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

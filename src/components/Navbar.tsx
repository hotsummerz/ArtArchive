// ponytail: editorial navigation bar with responsive mobile menu & live counter badges

import { Bookmark, Compass, ExternalLink, Heart, Menu, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CONFIG } from '../config';
import { useCollections } from '../context/CollectionsContext';
import { useFavorites } from '../context/FavoritesContext';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { favorites } = useFavorites();
  const { collections } = useCollections();

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="navbar">
      <a href="#main-content" className="skip-link">
        Lewati ke Konten Utama
      </a>

      <div className="navbar__container">
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          <span className="navbar__title">Art Archive</span>
          <span className="navbar__subtitle">A Digital Collection of Fine Art</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar__nav" aria-label="Navigasi utama">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}
          >
            <Compass size={17} aria-hidden="true" />
            <span>Jelajah</span>
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}
          >
            <Heart size={17} aria-hidden="true" />
            <span>Favorit</span>
            {favorites.length > 0 && (
              <span className="navbar__badge" aria-label={`${favorites.length} favorit tersimpan`}>
                {favorites.length}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/collections"
            className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}
          >
            <Bookmark size={17} aria-hidden="true" />
            <span>Koleksi</span>
            {collections.length > 0 && (
              <span className="navbar__badge" aria-label={`${collections.length} koleksi pribadi`}>
                {collections.length}
              </span>
            )}
          </NavLink>

          <a
            href={CONFIG.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__link"
            title="Website Profil Pribadi"
          >
            <User size={17} aria-hidden="true" />
            <span>Profil</span>
            <ExternalLink size={13} aria-hidden="true" style={{ opacity: 0.7 }} />
          </a>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          className="navbar__mobile-toggle"
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <nav className="navbar__mobile-menu" aria-label="Menu navigasi mobile">
          <NavLink
            to="/"
            end
            onClick={closeMenu}
            className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}
          >
            <Compass size={18} />
            <span>Jelajah Galeri</span>
          </NavLink>

          <NavLink
            to="/favorites"
            onClick={closeMenu}
            className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}
          >
            <Heart size={18} />
            <span>Karya Favorit ({favorites.length})</span>
          </NavLink>

          <NavLink
            to="/collections"
            onClick={closeMenu}
            className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}
          >
            <Bookmark size={18} />
            <span>Koleksi Pribadi ({collections.length})</span>
          </NavLink>

          <a
            href={CONFIG.profileUrl}
            onClick={closeMenu}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__link"
          >
            <User size={18} />
            <span>Profil</span>
            <ExternalLink size={14} style={{ opacity: 0.7 }} />
          </a>
        </nav>
      )}
    </header>
  );
};

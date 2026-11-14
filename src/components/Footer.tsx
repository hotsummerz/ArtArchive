// ponytail: footer with student credentials & profile link

import { ExternalLink, Palette } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../config';

export const Footer: React.FC = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <Palette size={22} color="var(--color-primary)" />
            <h3>Art Archive</h3>
          </div>
          <p className="footer__tagline">
            Sebuah platform digital kurasi karya seni rupa untuk menjelajahi keindahan lukisan dari berbagai seniman, periode, dan aliran dunia.
          </p>
        </div>

        <div className="footer__section">
          <h4>Navigasi</h4>
          <ul className="footer__links">
            <li><Link to="/">Jelajah Galeri</Link></li>
            <li><Link to="/favorites">Karya Favorit</Link></li>
            <li><Link to="/collections">Koleksi Kurasi</Link></li>
          </ul>
        </div>

        <div className="footer__section">
          <h4>Akademik & Pengembang</h4>
          <ul className="footer__links">
            <li>
              <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{CONFIG.studentName}</span>
            </li>
            <li>NIM: {CONFIG.studentNim}</li>
            <li>Mata Kuliah: {CONFIG.courseName}</li>
            <li style={{ marginTop: 'var(--space-2)' }}>
              <a
                href={CONFIG.profileUrl}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: 500 }}
              >
                <span>Website Pribadi</span>
                <ExternalLink size={13} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>
          &copy; {new Date().getFullYear()} Art Archive. Data seni rupa terbuka melalui Open Access API.
        </p>
        <p>
          Dibangun dengan React, Vite, TypeScript &amp; React Router.
        </p>
      </div>
    </footer>
  );
};

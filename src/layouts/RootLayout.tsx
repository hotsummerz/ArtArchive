// ponytail: root layout wrapping Navbar, main outlet, and Footer with scroll-to-top on route change

import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

export const RootLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top on pathname changes (without full page reload)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="app-layout">
      <Navbar />
      <main id="main-content" className="main-content" key={pathname}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

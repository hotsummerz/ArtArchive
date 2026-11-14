// ponytail: unified provider composition root

import React from 'react';
import { CollectionsProvider } from './CollectionsContext';
import { FavoritesProvider } from './FavoritesContext';
import { NotesProvider } from './NotesContext';
import { ToastProvider } from './ToastContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ToastProvider>
      <FavoritesProvider>
        <CollectionsProvider>
          <NotesProvider>
            {children}
          </NotesProvider>
        </CollectionsProvider>
      </FavoritesProvider>
    </ToastProvider>
  );
};

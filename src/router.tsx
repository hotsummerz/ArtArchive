// ponytail: declarative React Router definition using createBrowserRouter and nested layouts

import { createBrowserRouter } from 'react-router-dom';
import { CollectionsLayout } from './layouts/CollectionsLayout';
import { RootLayout } from './layouts/RootLayout';
import { ArtworkDetailPage } from './pages/ArtworkDetailPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'artwork/:id',
        element: <ArtworkDetailPage />
      },
      {
        path: 'favorites',
        element: <FavoritesPage />
      },
      {
        path: 'collections',
        element: <CollectionsLayout />,
        children: [
          {
            index: true,
            element: <CollectionsPage />
          },
          {
            path: ':collectionId',
            element: <CollectionDetailPage />
          }
        ]
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);

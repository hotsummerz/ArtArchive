# Art Archive

Aplikasi web untuk menjelajahi dan mengarsipkan koleksi seni rupa digital dari museum dunia. Dibangun dengan React + Vite + TypeScript sebagai tugas Mata Kuliah Pengembangan Aplikasi Web.

## Fitur

- ✅ Jelajahi galeri lukisan dari museum open access
- ✅ Search by judul atau nama seniman
- ✅ Filter berdasarkan gaya seni (Impressionism, Renaissance, dll)
- ✅ Sort berdasarkan tanggal, judul, atau seniman
- ✅ Detail karya seni dengan metadata lengkap
- ✅ Simpan karya favorit
- ✅ Buat koleksi pribadi dengan tema custom
- ✅ Tulis catatan pribadi untuk setiap karya
- ✅ Pagination untuk navigasi galeri
- ✅ Client-side routing dengan deep linking
- ✅ Persistensi data ke localStorage
- ✅ Responsif (mobile-first)

## Tech Stack

- **React 18** - UI library
- **Vite 5** - Build tool & dev server
- **TypeScript** - Type safety
- **React Router DOM 6** - Client-side routing
- **CSS** - Plain CSS dengan design tokens
- **Lucide React** - Icon library
- **localStorage** - Data persistence
- **Cleveland Museum of Art API** - Sumber data lukisan

## Konsep React yang Diterapkan

### 1. Routing & Navigation
- `createBrowserRouter` dengan 6 routes
- Dynamic routes (`/artwork/:id`, `/collections/:id`)
- Nested layouts (`RootLayout`, `CollectionsLayout`)
- 404 handling dengan `NotFoundPage`
- SPA fallback untuk GitHub Pages

### 2. State Management (5 Tipe)
- **Local State**: Modal visibility, form drafts, toggle states
- **Global State**: `FavoritesContext`, `CollectionsContext`, `NotesContext`, `ToastContext`
- **Server State**: `useArtworks`, `useArtwork` dengan loading & error handling
- **URL State**: `useArtworkFilters` dengan `useSearchParams`
- **Form State**: Controlled inputs dengan validasi

### 3. Components (17 Komponen)
- Layout: `RootLayout`, `CollectionsLayout`, `Navbar`, `Footer`
- Pages: `HomePage`, `ArtworkDetailPage`, `FavoritesPage`, `CollectionsPage`, `CollectionDetailPage`, `NotFoundPage`
- UI: `ArtworkCard`, `ArtworkGrid`, `CollectionCard`, `Badge`, `SearchBar`, `SortSelect`, `Pagination`
- Feedback: `EmptyState`, `ErrorState`, `SkeletonCard`
- Interactive: `FavoriteButton`, `AddToCollectionModal`, `ConfirmDialog`, `PageHeader`

### 4. Custom Hooks (6 Hooks)
- `useLocalStorage` - Persistent state
- `useDebounce` - Debounced search (400ms)
- `useDocumentTitle` - Dynamic page titles
- `useArtworkFilters` - URL-synced filters
- `useArtworks` - Fetch & cache artworks
- `useArtwork` - Fetch single artwork detail

### 5. Data Fetching & API
- Native `fetch` dengan `AbortController` untuk request cancellation
- Memory cache dengan TTL
- Loading states dengan skeleton placeholders
- Error handling dengan retry mechanism
- Empty state UI

### 6. Form & Validation
- Collection form: nama (3-40 chars, unique), deskripsi (max 200 chars)
- Note form: catatan (5-1000 chars)
- Real-time validation dengan `aria-invalid`
- Character counter
- Accessible error messages

## Struktur Folder

```
src/
├── main.tsx              # Entry point
├── router.tsx            # Router configuration
├── types.ts              # TypeScript interfaces
├── config.ts             # Environment variables
├── style.css             # Complete design system
├── components/           # 17 React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── PageHeader.tsx
│   ├── SearchBar.tsx
│   ├── SortSelect.tsx
│   ├── Pagination.tsx
│   ├── ArtworkCard.tsx
│   ├── ArtworkGrid.tsx
│   ├── CollectionCard.tsx
│   ├── Badge.tsx
│   ├── FavoriteButton.tsx
│   ├── AddToCollectionModal.tsx
│   ├── ConfirmDialog.tsx
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   └── SkeletonCard.tsx
├── pages/                # Route pages
│   ├── HomePage.tsx
│   ├── ArtworkDetailPage.tsx
│   ├── FavoritesPage.tsx
│   ├── CollectionsPage.tsx
│   ├── CollectionDetailPage.tsx
│   └── NotFoundPage.tsx
├── layouts/              # Layout wrappers
│   ├── RootLayout.tsx
│   └── CollectionsLayout.tsx
├── context/              # React Context providers
│   ├── AppProviders.tsx
│   ├── FavoritesContext.tsx
│   ├── CollectionsContext.tsx
│   ├── NotesContext.tsx
│   └── ToastContext.tsx
├── hooks/                # Custom hooks
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   ├── useDocumentTitle.ts
│   ├── useArtworkFilters.ts
│   ├── useArtworks.ts
│   └── useArtwork.ts
├── services/             # API layer
│   ├── http.ts
│   └── artworkService.ts
└── utils/                # Pure utility functions
    ├── image.ts
    ├── pagination.ts
    ├── text.ts
    └── validators.ts
```

## Setup & Development

1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Run TypeScript typecheck:
   ```bash
   npm run typecheck
   ```
5. Build untuk production:
   ```bash
   npm run build
   ```

## Data Model

```typescript
interface Artwork {
  id: string;
  title: string;
  artist: string;
  artistBio?: string;
  date: string;
  medium?: string;
  dimensions?: string;
  style?: string;
  origin?: string;
  department?: string;
  description?: string;
  imageUrl: string;
  imageId?: string;
  isPublicDomain: boolean;
  creditLine?: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  artworkIds: string[];
  createdAt: number;
  updatedAt: number;
}

interface Note {
  artworkId: string;
  text: string;
  updatedAt: number;
}
```

## API Documentation

**Cleveland Museum of Art Open Access API**
- Base URL: `https://openaccess-api.clevelandart.org/api/artworks/`
- License: CC0 Public Domain
- No API key required
- Full CORS support
- High-resolution images via CDN

## Deployment

Deploy otomatis ke GitHub Pages lewat `.github/workflows/deploy.yml` setiap push ke `main`.

1. Aktifkan Pages: **Settings → Pages → Source: GitHub Actions**
2. Set workflow permissions: **Settings → Actions → General → Read and write permissions**
3. Push ke `main` atau re-run workflow

Custom domain: ubah `base: '/'` di `vite.config.ts`, tambah CNAME record di DNS provider.

## Browser Support

- Chrome/Edge (modern)
- Firefox (modern)
- Safari (modern)
- Requires JavaScript enabled
- LocalStorage available

## Tugas Requirements ✅

- [x] React + Vite + TypeScript
- [x] Routing & Navigation (6 routes, nested layouts, dynamic params)
- [x] State Management (5 tipe: local, global, server, URL, form)
- [x] Data Fetching & API (fetch, loading, error, cache, cancellation)
- [x] Search, Filter, Sort, Pagination, Detail
- [x] Form & Validasi (2 forms dengan validasi real-time)
- [x] Custom Hooks (6 hooks)
- [x] >= 10 komponen (dibuat 17)
- [x] Responsif mobile-first
- [x] Nama & NIM tampil
- [x] No errors in console
- [x] >= 5 commits
- [x] Published online

## License

Project ini dibuat untuk keperluan tugas akademik Mata Kuliah Pengembangan Aplikasi Web.

## Kontak

**Keira Arina Khalisha**  
NIM: 1247050056  
Website: [https://hotsummerz.my.id/](https://hotsummerz.my.id/)

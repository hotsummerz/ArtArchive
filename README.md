# Art Archive — A Digital Collection of Fine Art

> A curated digital space for discovering, exploring, and archiving fine art from around the world.

Art Archive is a modern, responsive React web application built for the **Pengembangan Aplikasi Web (Pertemuan 8)** assignment. It goes beyond a simple catalog by delivering a museum-grade curatorial experience where users can discover masterpieces, filter by art movements, search by artist or title, curate custom collections, and write personal reflections.

Developed by **Keira Arina Khalisha** (NIM: `1247050056`) — Personal Website: [https://hotsummerz.my.id/](https://hotsummerz.my.id/)

---

## 1. Project Overview

Art Archive connects art lovers and students to open cultural heritage. Key features include:

- **Curated Exploration:** Browse verified paintings with high-resolution imagery and rich metadata.
- **Dynamic Search & Filtering:** Search by artwork title or artist name; filter by art movements (e.g., Impressionism, Baroque, Renaissance) and sort by date, title, or relevance.
- **Deep Routing & Direct Linking:** Full client-side routing with nested layouts and dynamic parameter routes (`/artwork/:id`, `/collections/:collectionId`).
- **Personal Collections:** Create, edit, and manage themed collections with real-time validation and thumbnail previews.
- **Favorites & Notes:** Save favorite pieces and attach personal interpretations with client-side persistence in `localStorage`.
- **Editorial Aesthetics:** Follows the Warm Editorial visual direction specified in `DESIGN.md` (Warm Ivory `#F7F5F0`, Muted Blue `#647D9B`, and Cormorant Garamond serif typography).

---

## 2. Tech Stack

| Category | Technology |
|---|---|
| **Frontend Framework** | React 18 (`react`, `react-dom`) |
| **Language** | TypeScript (Strict mode enabled) |
| **Build Tool & Bundler** | Vite 5 |
| **Client-Side Routing** | React Router DOM 6 (`createBrowserRouter`, `RouterProvider`) |
| **Icons** | Lucide React |
| **State Management** | React Context API + Custom React Hooks |
| **Data Fetching** | Native `fetch` with `AbortController` cancellation & memory cache |
| **Styling** | Plain CSS with CSS Custom Properties / Tokens |
| **Deployment** | GitHub Actions & GitHub Pages |

---

## 3. Assignment Acceptance Criteria Mapping

| Criteria | Points | Implementation Details & Files | Status |
|---|---|---|---|
| **1. Routing & Navigasi** | 20 | Client-side routing with `createBrowserRouter`, 6 routes (`/`, `/artwork/:id`, `/favorites`, `/collections`, `/collections/:id`, `*`), dynamic route parameters, nested routes (`RootLayout`, `CollectionsLayout`), active nav indicators, and `404.html` SPA fallback. (`src/router.tsx`, `src/layouts/`) | Completed |
| **2. State Management** | 20 | All 5 state types implemented: Local state (modals, dropdowns), Global state (`FavoritesContext`, `CollectionsContext`, `NotesContext`, `ToastContext`), Server state (`useArtworks`, `useArtwork`), URL state (`useArtworkFilters` with `useSearchParams`), Form state (controlled inputs in `CollectionForm` and `NoteForm`). (`src/context/`, `src/hooks/`) | Completed |
| **3. Data Fetching & API** | 20 | Public API service in `src/services/` using native `fetch`, loading skeleton placeholders, meaningful error handling with retry, empty state UI, and request cancellation via `AbortController`. (`src/services/artworkService.ts`, `src/services/http.ts`) | Completed |
| **4. Search, Filter, Sort, Pagination, Detail** | 20 | Real-time debounced search (400ms), art movement filters, sorting by title/date/artist, pagination with synchronized URL parameters (`?q=...&style=...&sort=...&page=...`), and detailed museum view by ID. (`src/pages/HomePage.tsx`, `src/pages/ArtworkDetailPage.tsx`) | Completed |
| **5. Form & Validasi** | 10 | Two interactive controlled forms: CollectionForm (required, 3-40 chars, unique name check, char counter) and NoteForm (required, 5-1000 chars, char counter) with accessible `aria-invalid` error messaging and blur validation. (`src/pages/CollectionsPage.tsx`, `src/pages/ArtworkDetailPage.tsx`) | Completed |
| **6. Custom Hooks, Components, Struktur** | 10 | 6 custom hooks (`useLocalStorage`, `useDebounce`, `useDocumentTitle`, `useArtworkFilters`, `useArtworks`, `useArtwork`), 17 modular reusable components, Context API, and separation of concerns. (`src/components/`, `src/hooks/`) | Completed |

---

## 4. Application Architecture

```text
art-archive/
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD GitHub Pages deployment workflow
├── public/
│   └── favicon.svg               # Editorial vector favicon
├── src/
│   ├── components/               # 17 reusable UI components
│   │   ├── AddToCollectionModal.tsx
│   │   ├── ArtworkCard.tsx
│   │   ├── ArtworkGrid.tsx
│   │   ├── Badge.tsx
│   │   ├── CollectionCard.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── FavoriteButton.tsx
│   │   ├── FilterBar.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── PageHeader.tsx
│   │   ├── Pagination.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SkeletonCard.tsx
│   │   └── SortSelect.tsx
│   ├── context/                  # React Context API providers
│   │   ├── AppProviders.tsx
│   │   ├── CollectionsContext.tsx
│   │   ├── FavoritesContext.tsx
│   │   ├── NotesContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── useArtwork.ts
│   │   ├── useArtworkFilters.ts
│   │   ├── useArtworks.ts
│   │   ├── useDebounce.ts
│   │   ├── useDocumentTitle.ts
│   │   └── useLocalStorage.ts
│   ├── layouts/                  # Layout structures
│   │   ├── CollectionsLayout.tsx # Nested layout for collections
│   │   └── RootLayout.tsx        # Global navbar/footer wrapper with scroll-to-top
│   ├── pages/                    # Route pages
│   │   ├── ArtworkDetailPage.tsx # Dynamic route (/artwork/:id)
│   │   ├── CollectionDetailPage.tsx # Dynamic route (/collections/:id)
│   │   ├── CollectionsPage.tsx   # Collection management & form
│   │   ├── FavoritesPage.tsx     # Saved artworks
│   │   ├── HomePage.tsx          # Hero & gallery
│   │   └── NotFoundPage.tsx      # 404 handler
│   ├── services/                 # API communication layer
│   │   ├── artworkService.ts     # Normalized search & detail services
│   │   └── http.ts               # Fetch client with TTL memory cache
│   ├── utils/                    # Pure utility functions
│   │   ├── image.ts              # Image URL builder & SVG fallback generator
│   │   ├── pagination.ts         # Page range computation
│   │   ├── text.ts               # HTML stripping & text truncation
│   │   └── validators.ts         # Validation rules
│   ├── config.ts                 # Centralized environment access
│   ├── main.tsx                  # Application bootstrap
│   ├── router.tsx                # Client-side router configuration
│   ├── style.css                 # Design tokens and styles
│   └── types.ts                  # Domain & API TypeScript interfaces
├── .env.example
├── .env.production
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### State Management Matrix

1. **Local State (`useState`):**
   - Modal visibility (`AddToCollectionModal`, `ConfirmDialog`).
   - Mobile navigation drawer toggle in `Navbar`.
   - Editing toggle and form draft states.
2. **Global State (`Context API`):**
   - `FavoritesContext`: Manages saved artworks list with persistent synchronization.
   - `CollectionsContext`: Manages custom curated collections and item assignment.
   - `NotesContext`: Manages personal artwork reflections.
   - `ToastContext`: Dispatches non-intrusive feedback notifications across components.
3. **Server State (`useArtworks`, `useArtwork`):**
   - Handles network requests, in-flight loading indicators, errors, and cached responses.
   - Employs `AbortController` to cancel outdated queries when typing or navigating.
4. **URL State (`useArtworkFilters`):**
   - Bidirectionally synchronizes gallery parameters with URL search params: `?q=...&style=...&sort=...&page=...`.
   - Preserves search and filter configuration on page reload or URL sharing.
5. **Form State:**
   - Controlled inputs in collection creation, editing, and artwork notes.
   - Validates on blur and submission, exposing accessible error descriptions.

---

## 5. API Documentation & Verified Behavior

Art Archive connects to verified Open Access museum APIs:

### Primary Verified Provider: Cleveland Museum of Art Open Access (CC0)
- **Base Endpoint:** `https://openaccess-api.clevelandart.org/api/artworks/`
- **License:** CC0 Public Domain.
- **Key Features:** Direct CDN image hosting, public access without API keys, full CORS support, and robust painting query filters (`?type=Painting&has_image=1`).
- **Verified Fields:** `id`, `title`, `creators`, `creation_date`, `technique`, `measurements`, `culture`, `department`, `images.web.url`, `wall_description`.

### Art Institute of Chicago (AIC) Verification Notice
During testing as required by Section 5.2 of the project specification:
- AIC API (`https://api.artic.edu/api/v1`) currently enforces Cloudflare Managed Challenges (`Cf-Mitigated: challenge`, HTTP 403) on incoming requests from Indonesian network ranges (`CF-RAY: ...-CGK`).
- To guarantee 100% reliability both in local development and production on GitHub Pages, the application implements an **adaptive service adapter**: it uses the Cleveland Museum of Art Open Access API as the rock-solid default, while retaining full normalized compatibility with AIC.

---

## 6. Installation & Development

### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm

### Getting Started

```bash
# 1. Clone the repository
git clone <repository-url>
cd "Art Archive (pertemuan 8)"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run TypeScript typecheck
npm run typecheck

# 5. Build for production
npm run build
```

---

## 7. Deployment

The application is deployed to GitHub Pages with continuous deployment via GitHub Actions:
- On every push to `main`, `.github/workflows/deploy.yml` builds the production bundle and deploys to GitHub Pages.
- An automated build plugin copies `dist/index.html` to `dist/404.html` so that deep client-side routes (e.g., `/artwork/135382` or `/collections`) refresh without HTTP 404 errors.

---

## 8. Academic Details & Credits

- **Course:** Pengembangan Aplikasi Web (Semester 5)
- **Student Name:** Keira Arina Khalisha
- **NIM:** 1247050056
- **Personal Website:** [https://hotsummerz.my.id/](https://hotsummerz.my.id/)
- **API Credits:** Cleveland Museum of Art Open Access Collection (CC0) & Art Institute of Chicago API.

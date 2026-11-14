// ponytail: consolidated core interfaces across domain, API, and persistence

export interface ArtworkSummary {
  id: number | string;
  title: string;
  artist: string;
  date: string;
  imageId: string | null;
  imageUrl?: string | null;
  style?: string;
  classification?: string;
}

export interface Artwork extends ArtworkSummary {
  medium: string;
  dimensions?: string;
  origin?: string;
  description?: string;
  creditLine?: string;
  isPublicDomain: boolean;
  department?: string;
  artistBio?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  items: ArtworkSummary[];
  createdAt: number;
  updatedAt: number;
}

export interface Note {
  artworkId: number | string;
  text: string;
  updatedAt: number;
}

export interface ArtworkSearchResult {
  items: ArtworkSummary[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type SortOption =
  | 'relevance'
  | 'title-asc'
  | 'title-desc'
  | 'date-asc'
  | 'date-desc'
  | 'artist-asc';

export interface FilterParams {
  q?: string;
  style?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'info' | 'success' | 'error';
}

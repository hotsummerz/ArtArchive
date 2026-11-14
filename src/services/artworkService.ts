// ponytail: normalized artwork service supporting verified Open Access museum APIs

import { CONFIG } from '../config';
import { Artwork, ArtworkSearchResult, ArtworkSummary, FilterParams } from '../types';
import { stripHtml } from '../utils/text';
import { httpGet } from './http';

const PAGE_SIZE = 12;

export async function searchArtworks(
  params: FilterParams = {},
  signal?: AbortSignal
): Promise<ArtworkSearchResult> {
  const page = Math.max(1, params.page || 1);
  const limit = params.limit || PAGE_SIZE;
  const skip = (page - 1) * limit;
  const query = params.q?.trim() || '';
  const style = params.style && params.style !== 'Semua Aliran' ? params.style : '';

  // Try primary provider (Cleveland Museum of Art - verified open CC0 API without Cloudflare captcha)
  if (CONFIG.apiProvider === 'cleveland') {
    return fetchFromCleveland(query, style, skip, limit, page, params.sort, signal);
  }

  // Art Institute of Chicago attempt with fallback
  try {
    return await fetchFromAIC(query, style, page, limit, params.sort, signal);
  } catch (err) {
    console.warn('AIC API unavailable, falling back to Cleveland Open Access API:', err);
    return fetchFromCleveland(query, style, skip, limit, page, params.sort, signal);
  }
}

export async function getArtworkById(id: string | number, signal?: AbortSignal): Promise<Artwork> {
  if (CONFIG.apiProvider === 'cleveland') {
    return getArtworkFromCleveland(id, signal);
  }

  try {
    return await getArtworkFromAIC(id, signal);
  } catch (err) {
    console.warn('AIC detail unavailable, trying Cleveland Museum API:', err);
    return getArtworkFromCleveland(id, signal);
  }
}

// ============================================================================
// Cleveland Museum of Art Implementation (Verified Open CC0)
// ============================================================================

interface CmaImage {
  url?: string;
}

interface CmaCreator {
  description?: string;
  biography?: string;
}

interface CmaArtwork {
  id: number;
  title: string;
  creation_date?: string;
  technique?: string;
  measurements?: string;
  culture?: string[];
  department?: string;
  collection?: string;
  creditline?: string;
  share_license_status?: string;
  tombstone?: string;
  images?: {
    web?: CmaImage;
    print?: CmaImage;
    full?: CmaImage;
  };
  creators?: CmaCreator[];
  wall_description?: string;
}

interface CmaResponse {
  info: {
    total: number;
  };
  data: CmaArtwork[];
}

async function fetchFromCleveland(
  query: string,
  style: string,
  skip: number,
  limit: number,
  page: number,
  sort = 'relevance',
  signal?: AbortSignal
): Promise<ArtworkSearchResult> {
  // Combine query with movement/style if specified
  const searchTerms = [query, style].filter(Boolean).join(' ');
  const searchParam = searchTerms ? `&q=${encodeURIComponent(searchTerms)}` : '';
  const url = `${CONFIG.cmaApiBase}/artworks/?has_image=1&type=Painting${searchParam}&skip=${skip}&limit=${limit}`;

  const res = await httpGet<CmaResponse>(url, { signal });
  let items: ArtworkSummary[] = (res.data || []).map((item: CmaArtwork) => {
    const artist = item.creators?.[0]?.description?.split('(')[0]?.trim() || 'Seniman Tidak Diketahui';
    const imageUrl = item.images?.web?.url || item.images?.print?.url || null;
    return {
      id: item.id,
      title: item.title || 'Tanpa Judul',
      artist,
      date: item.creation_date || 'Periode Tidak Diketahui',
      imageId: imageUrl,
      imageUrl,
      style: item.department || item.collection || style || 'Seni Rupa',
      classification: 'Painting'
    };
  });

  // Client-side sorting for current page results (documented transparently)
  items = applySorting(items, sort);

  const total = res.info?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items,
    total,
    totalPages,
    currentPage: page
  };
}

async function getArtworkFromCleveland(id: string | number, signal?: AbortSignal): Promise<Artwork> {
  const url = `${CONFIG.cmaApiBase}/artworks/${id}`;
  const res = await httpGet<{ data: CmaArtwork }>(url, { signal });
  const item = res.data;

  if (!item) {
    throw new Error('Karya seni tidak ditemukan.');
  }

  const primaryCreator = item.creators?.[0];
  const artist = primaryCreator?.description?.split('(')[0]?.trim() || 'Seniman Tidak Diketahui';
  const imageUrl = item.images?.web?.url || item.images?.print?.url || null;
  const origin = Array.isArray(item.culture) && item.culture.length > 0 ? item.culture.join(', ') : undefined;

  return {
    id: item.id,
    title: item.title || 'Tanpa Judul',
    artist,
    date: item.creation_date || 'Periode Tidak Diketahui',
    imageId: imageUrl,
    imageUrl,
    medium: item.technique || 'Cat minyak pada kanvas',
    dimensions: item.measurements || undefined,
    origin,
    description: item.wall_description || item.tombstone || `Koleksi resmi dari departemen ${item.department || 'lukisan'}.`,
    creditLine: item.creditline || 'Koleksi Museum Seni Cleveland (CC0 Public Domain)',
    isPublicDomain: item.share_license_status === 'CC0',
    department: item.department || undefined,
    artistBio: primaryCreator?.biography || undefined,
    style: item.department || item.collection || 'Fine Art',
    classification: 'Painting'
  };
}

// ============================================================================
// Art Institute of Chicago Implementation
// ============================================================================

interface AicArtwork {
  id: number;
  title: string;
  artist_title?: string;
  artist_display?: string;
  date_display?: string;
  image_id?: string;
  style_title?: string;
  medium_display?: string;
  dimensions?: string;
  place_of_origin?: string;
  description?: string;
  credit_line?: string;
  is_public_domain?: boolean;
}

interface AicResponse {
  pagination: {
    total: number;
    total_pages: number;
    current_page: number;
  };
  data: AicArtwork[];
}

async function fetchFromAIC(
  query: string,
  style: string,
  page: number,
  limit: number,
  sort = 'relevance',
  signal?: AbortSignal
): Promise<ArtworkSearchResult> {
  const fields = 'id,title,artist_title,artist_display,date_display,image_id,style_title';
  let url: string;

  if (query || style) {
    const q = [query, style].filter(Boolean).join(' ');
    url = `${CONFIG.aicApiBase}/artworks/search?q=${encodeURIComponent(q)}&fields=${fields}&page=${page}&limit=${limit}&query[term][artwork_type_title]=Painting`;
  } else {
    url = `${CONFIG.aicApiBase}/artworks?fields=${fields}&page=${page}&limit=${limit}&query[term][artwork_type_title]=Painting`;
  }

  const res = await httpGet<AicResponse>(url, { signal });
  let items: ArtworkSummary[] = (res.data || []).map((item: AicArtwork) => ({
    id: item.id,
    title: item.title || 'Tanpa Judul',
    artist: item.artist_title || item.artist_display || 'Seniman Tidak Diketahui',
    date: item.date_display || 'Periode Tidak Diketahui',
    imageId: item.image_id || null,
    imageUrl: item.image_id ? `https://www.artic.edu/iiif/2/${item.image_id}/full/600,/0/default.jpg` : null,
    style: item.style_title || undefined,
    classification: 'Painting'
  }));

  items = applySorting(items, sort);

  return {
    items,
    total: res.pagination?.total || 0,
    totalPages: res.pagination?.total_pages || 1,
    currentPage: res.pagination?.current_page || page
  };
}

async function getArtworkFromAIC(id: string | number, signal?: AbortSignal): Promise<Artwork> {
  const fields = 'id,title,artist_title,artist_display,date_display,image_id,style_title,medium_display,dimensions,place_of_origin,description,credit_line,is_public_domain';
  const url = `${CONFIG.aicApiBase}/artworks/${id}?fields=${fields}`;
  const res = await httpGet<{ data: AicArtwork }>(url, { signal });
  const item = res.data;

  if (!item) {
    throw new Error('Karya seni tidak ditemukan.');
  }

  return {
    id: item.id,
    title: item.title || 'Tanpa Judul',
    artist: item.artist_title || item.artist_display || 'Seniman Tidak Diketahui',
    date: item.date_display || 'Periode Tidak Diketahui',
    imageId: item.image_id || null,
    imageUrl: item.image_id ? `https://www.artic.edu/iiif/2/${item.image_id}/full/843,/0/default.jpg` : null,
    medium: item.medium_display || 'Cat minyak pada kanvas',
    dimensions: item.dimensions || undefined,
    origin: item.place_of_origin || undefined,
    description: stripHtml(item.description) || 'Deskripsi kuratorial tidak tersedia untuk karya ini.',
    creditLine: item.credit_line || undefined,
    isPublicDomain: !!item.is_public_domain,
    style: item.style_title || undefined,
    classification: 'Painting'
  };
}

// ponytail: in-memory page sorter for consistent UX across both providers
function applySorting(items: ArtworkSummary[], sort: string): ArtworkSummary[] {
  const sorted = [...items];
  switch (sort) {
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'artist-asc':
      return sorted.sort((a, b) => a.artist.localeCompare(b.artist));
    case 'date-asc':
      return sorted.sort((a, b) => a.date.localeCompare(b.date));
    case 'date-desc':
      return sorted.sort((a, b) => b.date.localeCompare(a.date));
    default:
      return sorted;
  }
}

interface RequestOptions extends RequestInit {
  signal?: AbortSignal;
  skipCache?: boolean;
}

// In-memory cache by request URL
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class HttpError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export async function httpGet<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { signal, skipCache = false } = options;

  // Check cache
  if (!skipCache && cache.has(url)) {
    const cached = cache.get(url)!;
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data as T;
    }
    cache.delete(url);
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      signal
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new HttpError('Data karya seni tidak ditemukan (404).', 404);
      }
      if (response.status === 429) {
        throw new HttpError('Batas kuota permintaan API telah tercapai (429). Silakan coba beberapa saat lagi.', 429);
      }
      if (response.status >= 500) {
        throw new HttpError('Server museum sedang mengalami kendala (500). Silakan coba lagi nanti.', response.status);
      }
      throw new HttpError(`Gagal mengambil data dari server (${response.status}).`, response.status);
    }

    const data = (await response.json()) as T;

    // Cache successful responses
    if (!skipCache) {
      cache.set(url, { data, timestamp: Date.now() });
    }

    return data;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err; // Re-throw cancellation cleanly
    }
    if (err instanceof HttpError) {
      throw err;
    }
    throw new HttpError(
      'Gagal terhubung ke server. Periksa koneksi internet atau coba lagi.',
      0
    );
  }
}

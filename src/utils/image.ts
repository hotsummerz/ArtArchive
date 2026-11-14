// ponytail: clean image URL builder with SVG placeholder fallback

export function getArtworkImageUrl(imageId: string | null | undefined, directUrl?: string | null, width = 600): string {
  if (directUrl) return directUrl;
  if (!imageId) return createPlaceholderImageUrl('Karya Seni');

  // If imageId already starts with http/https, return it directly
  if (imageId.startsWith('http://') || imageId.startsWith('https://')) {
    return imageId;
  }

  // Art Institute of Chicago IIIF endpoint
  return `https://www.artic.edu/iiif/2/${imageId}/full/${width},/0/default.jpg`;
}

// ponytail: lightweight inline SVG placeholder so missing images never break the UI or layout
export function createPlaceholderImageUrl(text = 'Artwork'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
    <rect width="100%" height="100%" fill="#F1EEE7"/>
    <rect x="20" y="20" width="560" height="710" fill="none" stroke="#E7E1D8" stroke-width="2"/>
    <circle cx="300" cy="340" r="48" fill="#DCE5ED"/>
    <path d="M280 340 L300 320 L320 340" stroke="#647D9B" stroke-width="3" fill="none" stroke-linecap="round"/>
    <text x="50%" y="420" font-family="Georgia, serif" font-size="22" fill="#85858A" text-anchor="middle">${text}</text>
    <text x="50%" y="450" font-family="-apple-system, sans-serif" font-size="14" fill="#A18F7B" text-anchor="middle">Pratinjau Tidak Tersedia</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

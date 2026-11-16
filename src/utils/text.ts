export function stripHtml(htmlString?: string | null): string {
  if (!htmlString) return '';
  
  // Use browser DOMParser if available, otherwise regex fallback
  if (typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(htmlString, 'text/html');
      return doc.body.textContent?.trim() || '';
    } catch {
      // Fallback below
    }
  }

  return htmlString
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

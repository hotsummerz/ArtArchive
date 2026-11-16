import { useEffect } from 'react';
import { CONFIG } from '../config';

export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = `${title} — ${CONFIG.appName}`;
    } else {
      document.title = `${CONFIG.appName} — A Digital Collection of Fine Art`;
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}

import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { STORAGE_KEYS } from '../config';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Note } from '../types';
import { useToast } from './ToastContext';

interface NotesContextType {
  notes: Record<string, Note>;
  getNote: (artworkId: string | number) => Note | undefined;
  saveNote: (artworkId: string | number, text: string) => void;
  deleteNote: (artworkId: string | number) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useLocalStorage<Record<string, Note>>(STORAGE_KEYS.notes, {});
  const { showToast } = useToast();

  const getNote = useCallback(
    (artworkId: string | number) => notes[String(artworkId)],
    [notes]
  );

  const saveNote = useCallback(
    (artworkId: string | number, text: string) => {
      const idStr = String(artworkId);
      const trimmed = text.trim();
      setNotes(prev => ({
        ...prev,
        [idStr]: {
          artworkId,
          text: trimmed,
          updatedAt: Date.now()
        }
      }));
      showToast('Catatan pribadi berhasil disimpan.', 'success');
    },
    [setNotes, showToast]
  );

  const deleteNote = useCallback(
    (artworkId: string | number) => {
      const idStr = String(artworkId);
      setNotes(prev => {
        const next = { ...prev };
        delete next[idStr];
        return next;
      });
      showToast('Catatan telah dihapus.', 'info');
    },
    [setNotes, showToast]
  );

  const value = useMemo(
    () => ({ notes, getNote, saveNote, deleteNote }),
    [notes, getNote, saveNote, deleteNote]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export function useNotes(): NotesContextType {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}

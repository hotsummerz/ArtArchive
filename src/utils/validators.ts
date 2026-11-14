// ponytail: pure validation functions matching AGENT.md section 7 criteria

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCollectionName(name: string, existingNames: string[], currentId?: string, existingCollections?: { id: string; name: string }[]): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'Nama koleksi wajib diisi.';
  }
  if (trimmed.length < 3) {
    return 'Minimal 3 karakter.';
  }
  if (trimmed.length > 40) {
    return 'Maksimal 40 karakter.';
  }

  const isDuplicate = existingCollections
    ? existingCollections.some(
        c => c.id !== currentId && c.name.trim().toLowerCase() === trimmed.toLowerCase()
      )
    : existingNames.some(n => n.trim().toLowerCase() === trimmed.toLowerCase());

  if (isDuplicate) {
    return 'Nama koleksi sudah digunakan.';
  }

  return null;
}

export function validateCollectionDescription(desc: string): string | null {
  if (desc && desc.length > 200) {
    return 'Maksimal 200 karakter.';
  }
  return null;
}

export function validateNoteText(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) {
    return 'Catatan wajib diisi.';
  }
  if (trimmed.length < 5) {
    return 'Minimal 5 karakter.';
  }
  if (trimmed.length > 1000) {
    return 'Maksimal 1000 karakter.';
  }
  return null;
}

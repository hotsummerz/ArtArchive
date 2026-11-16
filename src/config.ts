export const CONFIG = {
  appName: import.meta.env.VITE_APP_NAME || 'Art Archive',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  courseName: import.meta.env.VITE_COURSE_NAME || 'Pengembangan Aplikasi Web',
  studentName: import.meta.env.VITE_STUDENT_NAME || 'Keira Arina Khalisha',
  studentNim: import.meta.env.VITE_STUDENT_NIM || '1247050056',
  profileUrl: import.meta.env.VITE_PROFILE_URL || 'https://hotsummerz.my.id/',
  apiProvider: (import.meta.env.VITE_API_PROVIDER as string) || 'cleveland',
  aicApiBase: import.meta.env.VITE_AIC_API_BASE || 'https://api.artic.edu/api/v1',
  cmaApiBase: import.meta.env.VITE_CMA_API_BASE || 'https://openaccess-api.clevelandart.org/api'
} as const;

export const STORAGE_KEYS = {
  favorites: 'art-archive:v1:favorites',
  collections: 'art-archive:v1:collections',
  notes: 'art-archive:v1:notes'
} as const;

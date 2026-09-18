import { create } from 'zustand';
import { TranslationSchema } from '../locales/types';
import { vi } from '../locales/vi';
import { en } from '../locales/en';

export type Language = 'vi' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const STORAGE_KEY = 'vibespace_v1_language';

function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'vi' || saved === 'en') {
      return saved;
    }
  } catch {
    // LocalStorage fallback
  }
  // Default to Vietnamese (vi) as requested
  return 'vi';
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: getInitialLanguage(),

  setLanguage: (lang: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // LocalStorage fallback
    }
    set({ language: lang });
  },

  toggleLanguage: () => {
    const nextLang = get().language === 'vi' ? 'en' : 'vi';
    get().setLanguage(nextLang);
  },
}));

/**
 * Hook to retrieve current translation schema and language utilities
 */
export function useTranslation() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);

  const t: TranslationSchema = language === 'en' ? en : vi;

  return {
    t,
    language,
    setLanguage,
    toggleLanguage,
    isVietnamese: language === 'vi',
  };
}

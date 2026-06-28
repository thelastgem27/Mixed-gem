import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Locale } from '@/lib/types';
import { getFullDictionary } from './get-dictionary';

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dictionary: any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getCookieLocale(): Locale {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  return (match?.[1] as Locale) || 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getCookieLocale);
  const [dictionary, setDictionary] = useState<any>({});

  useEffect(() => {
    getFullDictionary(locale).then(setDictionary);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
  };

  const t = React.useCallback(
    (key: string) => {
      if (!dictionary) return key;
      const parts = key.split('.');
      let value: any = dictionary;
      for (const part of parts) {
        value = value?.[part];
      }
      return typeof value === 'string' ? value : key;
    },
    [dictionary]
  );

  const value = React.useMemo(() => ({ locale, setLocale, t, dictionary }), [locale, t, dictionary]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

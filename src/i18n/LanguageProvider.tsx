import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { translate } from './translations';

export type Locale = 'en' | 'fr';
type LanguageContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: string) => string };
const LanguageContext = createContext<LanguageContextValue>({ locale: 'en', setLocale: () => {}, t: key => key });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => localStorage.getItem('missionlens-language') === 'fr' ? 'fr' : 'en');
  const setLocale = (next: Locale) => { localStorage.setItem('missionlens-language', next); setLocaleState(next); };
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = translate(locale, 'site.title');
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = translate(locale, 'site.description');
  }, [locale]);
  const value = useMemo(() => ({ locale, setLocale, t: (key: string) => translate(locale, key) }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }

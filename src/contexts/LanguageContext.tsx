/* eslint-disable react-refresh/only-export-components */
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Initialize from URL first if available
    const pathLang = globalThis.location?.pathname.split('/')[1];
    if (pathLang && ['es', 'en'].includes(pathLang)) {
      return pathLang as Language;
    }

    // Otherwise check localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['es', 'en'].includes(savedLanguage)) {
      return savedLanguage;
    }

    // Finally, detect browser language
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('en') ? 'en' : 'es';
  });

  useEffect(() => {
    // Save to localStorage whenever language changes
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

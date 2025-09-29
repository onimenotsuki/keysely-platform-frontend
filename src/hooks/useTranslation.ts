import { useLanguageContext } from '../contexts/LanguageContext';
import esTranslations from '../locales/es.json';
import enTranslations from '../locales/en.json';

const translations = {
  es: esTranslations,
  en: enTranslations,
};

export const useTranslation = () => {
  const { language } = useLanguageContext();

  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    if (!value) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }

    // Handle interpolation
    if (params && typeof value === 'string') {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  return { t, language };
};
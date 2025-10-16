import { useLanguageContext } from '../contexts/LanguageContext';
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';

const translations = {
  es: esTranslations,
  en: enTranslations,
};

export const useTranslation = () => {
  const { language } = useLanguageContext();

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: unknown = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        value = undefined;
      }
    }

    if (!value) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }

    // Handle interpolation
    if (params && typeof value === 'string') {
      let result = value;
      for (const [paramKey, paramValue] of Object.entries(params)) {
        const placeholder = `{{${paramKey}}}`;
        result = result.split(placeholder).join(paramValue.toString());
      }
      return result;
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, language };
};

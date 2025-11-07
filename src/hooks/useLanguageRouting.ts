import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Language, useLanguageContext } from '../contexts/LanguageContext';

/**
 * Hook to sync language between URL and context
 * Updates URL when language changes in context
 */
export const useLanguageRouting = () => {
  const { language, setLanguage } = useLanguageContext();
  const navigate = useNavigate();
  const params = useParams<{ lang: string }>();

  useEffect(() => {
    // Sync URL language param with context if they differ
    if (params.lang && params.lang !== language && ['es', 'en'].includes(params.lang)) {
      setLanguage(params.lang as Language);
    }
  }, [params.lang, language, setLanguage]);

  /**
   * Navigate to a path with the current language prefix
   */
  const navigateWithLang = (path: string) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    navigate(`/${language}/${cleanPath}`);
  };

  /**
   * Create a localized path with the current language prefix
   * This is useful for Link components
   */
  const createLocalizedPath = (path: string) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `/${language}/${cleanPath}`;
  };

  return { navigateWithLang, createLocalizedPath, currentLanguage: language };
};

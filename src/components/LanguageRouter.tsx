import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguageContext } from '../contexts/LanguageContext';

/**
 * Component that redirects to the language-prefixed version of the current route
 * Used for routes without language prefix
 */
export const LanguageRedirect = () => {
  const { language } = useLanguageContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Get the current path without the leading slash
    const currentPath = window.location.pathname.slice(1);

    // If we're at root, redirect to language home
    if (!currentPath || currentPath === '/') {
      navigate(`/${language}`, { replace: true });
    } else {
      // Otherwise, add language prefix to current path
      navigate(`/${language}/${currentPath}`, { replace: true });
    }
  }, [language, navigate]);

  return null;
};

/**
 * Wrapper component that ensures language is synced from URL to context
 */
export const LanguageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { language, setLanguage } = useLanguageContext();
  const params = useParams<{ lang: string }>();

  useEffect(() => {
    // Update context language if URL language is different and valid
    if (params.lang && params.lang !== language && ['es', 'en'].includes(params.lang)) {
      setLanguage(params.lang as 'es' | 'en');
    }
  }, [params.lang, language, setLanguage]);

  return <>{children}</>;
};

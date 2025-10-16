import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Language, useLanguageContext } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguageContext();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLanguage = language === 'es' ? 'en' : 'es';
    setLanguage(newLanguage);

    // Get the current path without the language prefix
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentPath = pathParts.slice(1).join('/'); // Remove language prefix

    // Navigate to the same path with the new language
    navigate(`/${newLanguage}/${currentPath}${location.search}${location.hash}`);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-300"
      aria-label={`Switch to ${language === 'es' ? 'English' : 'Spanish'}`}
    >
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium text-foreground">
          {language === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}
        </span>
        <i className="fas fa-chevron-down text-xs text-muted-foreground"></i>
      </div>
    </button>
  );
};

export default LanguageSelector;

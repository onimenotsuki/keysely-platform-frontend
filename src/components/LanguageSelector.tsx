import React from 'react';
import { useLanguageContext, Language } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguageContext();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
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
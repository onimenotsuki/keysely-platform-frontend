import { Check, Globe } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguageContext } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
  isScrolled?: boolean;
}

const LanguageSelector = ({ isScrolled = false }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguageContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
  ];

  const changeLanguage = (newLanguage: 'es' | 'en') => {
    setLanguage(newLanguage);
    setIsOpen(false);

    // Get the current path without the language prefix
    const pathParts = location.pathname.split('/').filter(Boolean);
    const currentPath = pathParts.slice(1).join('/'); // Remove language prefix

    // Navigate to the same path with the new language
    navigate(`/${newLanguage}/${currentPath}${location.search}${location.hash}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttonClass = isScrolled
    ? 'flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-300'
    : 'flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors duration-300';

  const iconClass = isScrolled ? 'w-5 h-5 text-foreground' : 'w-5 h-5 text-white';
  const textClass = isScrolled
    ? 'text-sm font-medium text-foreground'
    : 'text-sm font-medium text-white';

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClass}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className={iconClass} />
        <span className={textClass}>
          {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 ${
            isScrolled ? 'bg-background border-border' : 'bg-white border-gray-200'
          }`}
        >
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code as 'es' | 'en')}
                className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-muted transition-colors ${
                  language === lang.code ? 'bg-muted/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{lang.label}</span>
                </div>
                {language === lang.code && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

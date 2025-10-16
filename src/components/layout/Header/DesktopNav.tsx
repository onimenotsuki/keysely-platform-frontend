import { Link } from 'react-router-dom';
import { useLanguageContext } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';

export const DesktopNav = () => {
  const { t } = useTranslation();
  const { language } = useLanguageContext();

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link
        to={`/${language}`}
        className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
      >
        {t('header.home')}
      </Link>
      <Link
        to={`/${language}/explore`}
        className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
      >
        {t('header.explore')}
      </Link>
      <a
        href="#how-it-works"
        className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
      >
        {t('header.howItWorks')}
      </a>
      <Link
        to={`/${language}/list-space`}
        className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
      >
        {t('header.listSpace')}
      </Link>
    </nav>
  );
};

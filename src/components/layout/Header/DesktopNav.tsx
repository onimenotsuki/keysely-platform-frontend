import { Link } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';

export const DesktopNav = () => {
  const { t } = useTranslation();

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link
        to="/"
        className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
      >
        {t('header.home')}
      </Link>
      <Link
        to="/explore"
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
        to="/list-space"
        className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
      >
        {t('header.listSpace')}
      </Link>
    </nav>
  );
};

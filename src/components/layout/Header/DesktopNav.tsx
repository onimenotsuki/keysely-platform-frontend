import { Link } from 'react-router-dom';
import { useLanguageContext } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import LanguageSelector from '../../LanguageSelector';
import { UserMenu } from './UserMenu';

interface DesktopNavProps {
  isScrolled?: boolean;
}

export const DesktopNav = ({ isScrolled = false }: DesktopNavProps) => {
  const { t } = useTranslation();
  const { language } = useLanguageContext();

  const linkClass = isScrolled
    ? 'text-foreground hover:text-primary transition-colors duration-300 font-medium'
    : 'text-white hover:text-white/80 transition-colors duration-300 font-medium';

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <LanguageSelector isScrolled={isScrolled} />
      <Link to={`/${language}`} className={linkClass}>
        {t('header.home')}
      </Link>
      <Link to={`/${language}/explore`} className={linkClass}>
        {t('header.explore')}
      </Link>
      <a href="#how-it-works" className={linkClass}>
        {t('header.howItWorks')}
      </a>
      <Link to={`/${language}/host`} className={linkClass}>
        {t('header.listSpace')}
      </Link>
      <UserMenu isScrolled={isScrolled} />
    </nav>
  );
};

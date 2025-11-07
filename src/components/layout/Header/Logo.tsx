import { Link } from 'react-router-dom';
import logoImage from '../../../assets/logo-tr.png';
import { useLanguageContext } from '../../../contexts/LanguageContext';

interface LogoProps {
  isScrolled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ isScrolled = false, size = 'md' }: LogoProps) => {
  const { language } = useLanguageContext();

  return (
    <Link to={`/${language}`} className="flex items-center">
      <img
        src={logoImage}
        alt="Keysely Logo"
        className={`${size === 'sm' ? 'h-6' : size === 'md' ? 'h-8' : 'h-10'} w-auto transition-all duration-300 ${isScrolled ? '' : 'brightness-0 invert'}`}
      />
    </Link>
  );
};

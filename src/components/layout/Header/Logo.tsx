import { Link } from 'react-router-dom';
import logoImage from '../../../assets/logo.png';
import { useLanguageContext } from '../../../contexts/LanguageContext';

export const Logo = () => {
  const { language } = useLanguageContext();

  return (
    <Link to={`/${language}`} className="flex items-center">
      <img src={logoImage} alt="OfiKai Logo" className="h-10 w-auto" />
    </Link>
  );
};

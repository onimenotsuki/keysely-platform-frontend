import { Link } from 'react-router-dom';
import logoImage from '../../../assets/logo.png';

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img src={logoImage} alt="OfiKai Logo" className="h-10 w-auto" />
    </Link>
  );
};

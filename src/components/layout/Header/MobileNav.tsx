import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguageContext } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import LanguageSelector from '../../LanguageSelector';
import NotificationBell from '../../NotificationBell';

interface MobileNavProps {
  isOpen: boolean;
}

export const MobileNav = ({ isOpen }: MobileNavProps) => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { language } = useLanguageContext();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className={`mobile-menu ${isOpen ? 'open' : 'closed'}`}>
      <nav className="py-4 px-4 space-y-4">
        <Link
          to={`/${language}`}
          className="block text-foreground hover:text-primary transition-colors duration-300 font-medium"
        >
          {t('header.home')}
        </Link>
        <Link
          to={`/${language}/explore`}
          className="block text-foreground hover:text-primary transition-colors duration-300 font-medium"
        >
          {t('header.explore')}
        </Link>
        <a
          href="#how-it-works"
          className="block text-foreground hover:text-primary transition-colors duration-300 font-medium"
        >
          {t('header.howItWorks')}
        </a>
        <Link
          to={`/${language}/list-space`}
          className="block text-foreground hover:text-primary transition-colors duration-300 font-medium"
        >
          {t('header.listSpace')}
        </Link>

        <div className="pt-4 space-y-3">
          <div className="mb-3">
            <LanguageSelector />
          </div>
          {user && (
            <div className="mb-3">
              <NotificationBell />
            </div>
          )}

          {user ? (
            <>
              <Link to={`/${language}/owner-dashboard`}>
                <button className="btn-outline w-full">
                  <i className="fas fa-chart-line mr-2"></i>
                  {t('header.dashboard')}
                </button>
              </Link>
              <Link to={`/${language}/messages`}>
                <button className="btn-outline w-full">
                  <i className="fas fa-comments mr-2"></i>
                  Mensajes
                </button>
              </Link>
              <Link to={`/${language}/favorites`}>
                <button className="btn-outline w-full">
                  <i className="fas fa-heart mr-2"></i>
                  Favoritos
                </button>
              </Link>
              <Link to={`/${language}/list-space`}>
                <button className="btn-outline w-full">
                  <i className="fas fa-plus mr-2"></i>
                  {t('header.listSpace')}
                </button>
              </Link>
              <Link to={`/${language}/profile`}>
                <button className="btn-primary w-full">
                  <i className="fas fa-user mr-2"></i>
                  {t('header.profile')}
                </button>
              </Link>
              <button onClick={handleSignOut} className="btn-outline w-full">
                <i className="fas fa-sign-out-alt mr-2"></i>
                Salir
              </button>
            </>
          ) : (
            <Link to={`/${language}/auth`}>
              <button className="btn-primary w-full">
                <i className="fas fa-sign-in-alt mr-2"></i>
                Iniciar Sesión
              </button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguageContext } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import LanguageSelector from '../../LanguageSelector';
import NotificationBell from '../../NotificationBell';

export const HeaderActions = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { language } = useLanguageContext();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="hidden md:flex items-center space-x-3 ml-auto mr-[20px]">
      <LanguageSelector />
      {user && <NotificationBell />}

      {user ? (
        <>
          <Link to={`/${language}/owner-dashboard`}>
            <button className="btn-outline text-sm px-4 py-2">
              <i className="fas fa-chart-line mr-2"></i>
              {t('header.dashboard')}
            </button>
          </Link>
          <Link to={`/${language}/messages`}>
            <button className="btn-outline text-sm px-4 py-2">
              <i className="fas fa-comments mr-2"></i>
              Mensajes
            </button>
          </Link>
          <Link to={`/${language}/favorites`}>
            <button className="btn-outline text-sm px-4 py-2">
              <i className="fas fa-heart mr-2"></i>
              Favoritos
            </button>
          </Link>
          <Link to={`/${language}/list-space`}>
            <button className="btn-outline text-sm px-4 py-2">
              <i className="fas fa-plus mr-2"></i>
              {t('header.listSpace')}
            </button>
          </Link>
          <Link to={`/${language}/profile`}>
            <button className="btn-primary text-sm px-4 py-2">
              <i className="fas fa-user mr-2"></i>
              {t('header.profile')}
            </button>
          </Link>
          <button onClick={handleSignOut} className="btn-outline text-sm px-4 py-2">
            <i className="fas fa-sign-out-alt mr-2"></i>
            Salir
          </button>
        </>
      ) : (
        <Link to={`/${language}/auth`}>
          <button className="btn-primary text-sm px-4 py-2">
            <i className="fas fa-sign-in-alt mr-2"></i>
            Iniciar Sesión
          </button>
        </Link>
      )}
    </div>
  );
};

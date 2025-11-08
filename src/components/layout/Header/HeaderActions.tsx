import { Link } from 'react-router-dom';

import { createListSpaceStepPath } from '@/pages/list-space/paths';

import { useAuth } from '../../../contexts/AuthContext';
import { useLanguageContext } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { useProfile } from '@/hooks/useProfile';
import LanguageSelector from '../../LanguageSelector';
import NotificationBell from '../../NotificationBell';

interface HeaderActionsProps {
  isScrolled?: boolean;
}

export const HeaderActions = ({ isScrolled = false }: HeaderActionsProps) => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { language } = useLanguageContext();
  const { data: profile } = useProfile();

  const handleSignOut = async () => {
    await signOut();
  };

  const buttonClass = isScrolled
    ? 'btn-outline text-sm px-4 py-2'
    : 'border-2 border-white text-white hover:bg-white hover:text-[#1A2B42] px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm';

  const primaryButtonClass = isScrolled
    ? 'btn-primary text-sm px-4 py-2'
    : 'bg-white text-[#1A2B42] hover:bg-white/90 px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm';

  return (
    <div className="hidden md:flex items-center space-x-3 ml-auto mr-[20px]">
      <LanguageSelector isScrolled={isScrolled} />
      {user && <NotificationBell />}

      {user ? (
        <>
          {profile?.is_host && (
            <Link to={`/${language}/owner-dashboard`}>
              <button className={buttonClass}>
                <i className="fas fa-chart-line mr-2"></i>
                {t('header.hostDashboard')}
              </button>
            </Link>
          )}
          <Link to={`/${language}/messages`}>
            <button className={buttonClass}>
              <i className="fas fa-comments mr-2"></i>
              Mensajes
            </button>
          </Link>
          <Link to={`/${language}/favorites`}>
            <button className={buttonClass}>
              <i className="fas fa-heart mr-2"></i>
              Favoritos
            </button>
          </Link>
          <Link to={createListSpaceStepPath(language, user.id, 0)}>
            <button className={buttonClass}>
              <i className="fas fa-plus mr-2"></i>
              {t('header.listSpace')}
            </button>
          </Link>
          <Link to={`/${language}/profile`}>
            <button className={primaryButtonClass}>
              <i className="fas fa-user mr-2"></i>
              {t('header.profile')}
            </button>
          </Link>
          <button onClick={handleSignOut} className={buttonClass}>
            <i className="fas fa-sign-out-alt mr-2"></i>
            Salir
          </button>
        </>
      ) : (
        <Link to={`/${language}/auth`}>
          <button className={primaryButtonClass}>
            <i className="fas fa-sign-in-alt mr-2"></i>
            Iniciar Sesión
          </button>
        </Link>
      )}
    </div>
  );
};

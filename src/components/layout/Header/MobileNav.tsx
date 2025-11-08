import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguageContext } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';
import LanguageSelector from '../../LanguageSelector';
import NotificationBell from '../../NotificationBell';
import { User, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useProfile } from '@/hooks/useProfile';

interface MobileNavProps {
  isOpen: boolean;
  isScrolled?: boolean;
}

export const MobileNav = ({ isOpen, isScrolled = false }: MobileNavProps) => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { language } = useLanguageContext();
  const navigate = useNavigate();
  const { data: profile } = useProfile();

  const handleSignOut = async () => {
    await signOut();
    navigate(`/${language}`);
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
          to={`/${language}/host`}
          className="block text-foreground hover:text-primary transition-colors duration-300 font-medium"
        >
          {t('header.listSpace')}
        </Link>

        <div className="pt-4 space-y-3">
          <div className="mb-3">
            <LanguageSelector isScrolled={isScrolled} />
          </div>
          {user && (
            <div className="mb-3">
              <NotificationBell />
            </div>
          )}

          {user ? (
            <>
              <Separator className="my-3" />
              <div className="px-2 py-2">
                <p className="text-sm font-semibold text-gray-900">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Separator className="my-3" />

              <Button
                asChild
                variant="ghost"
                className="w-full justify-start text-left font-normal"
              >
                <Link to={`/${language}/profile`} className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('header.userMenu.profile')}</span>
                </Link>
              </Button>

              {profile?.is_host && (
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start text-left font-normal"
                >
                  <Link to={`/${language}/owner-dashboard`} className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>{t('header.userMenu.hostDashboard')}</span>
                  </Link>
                </Button>
              )}

              <Separator className="my-3" />

              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full justify-start text-left font-normal text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('header.userMenu.signOut')}</span>
              </Button>
            </>
          ) : (
            <Button
              asChild
              className="w-full bg-primary hover:bg-[#3B82F6] text-white font-semibold"
            >
              <Link to="/auth">{t('header.userMenu.signInOrRegister')}</Link>
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
};

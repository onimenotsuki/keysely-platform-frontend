import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguageRouting } from '@/hooks/useLanguageRouting';
import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { Heart, LayoutDashboard, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface UserMenuProps {
  isScrolled?: boolean;
}

export const UserMenu = ({ isScrolled = false }: UserMenuProps) => {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { t } = useTranslation();
  const { createLocalizedPath } = useLanguageRouting();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate(createLocalizedPath(`/`));
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    const names = user.user_metadata.full_name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const buttonClass = isScrolled
    ? 'bg-primary hover:bg-[#3B82F6] text-white'
    : 'bg-white hover:bg-white/90 text-[#1A2B42]';

  if (!user) {
    return (
      <Button
        asChild
        className={`${buttonClass} font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ml-4`}
      >
        <Link to={createLocalizedPath('/auth')}>{t('header.userMenu.signInOrRegister')}</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="ml-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full">
          <Avatar className="h-10 w-10 cursor-pointer border-2 border-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
            <AvatarFallback className="bg-primary text-white font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <div className="px-2 py-2">
          <p className="text-sm font-semibold text-gray-900">
            {user.user_metadata?.full_name || user.email}
          </p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <DropdownMenuItem asChild>
          <Link to={createLocalizedPath(`/profile`)} className="cursor-pointer flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{t('header.userMenu.profile')}</span>
          </Link>
        </DropdownMenuItem>
        {profile?.is_host && (
          <DropdownMenuItem asChild>
            <Link
              to={createLocalizedPath(`/owner-dashboard`)}
              className="cursor-pointer flex items-center"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>{t('header.userMenu.hostDashboard')}</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to={createLocalizedPath(`/favorites`)} className="cursor-pointer flex items-center">
            <Heart className="mr-2 h-4 w-4" />
            <span>{t('header.userMenu.favorites')}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 focus:text-white focus:bg-red-600 flex items-center"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('header.userMenu.signOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

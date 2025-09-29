import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import NotificationBell from './NotificationBell';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="navbar-sticky">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-building text-white text-sm"></i>
            </div>
            <span className="text-xl font-bold text-foreground">OfiKai</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors duration-300 font-medium">
              {t('header.home')}
            </Link>
            <Link to="/explore" className="text-foreground hover:text-primary transition-colors duration-300 font-medium">
              {t('header.explore')}
            </Link>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors duration-300 font-medium">
              {t('header.howItWorks')}
            </a>
            <Link to="/list-space" className="text-foreground hover:text-primary transition-colors duration-300 font-medium">
              {t('header.listSpace')}
            </Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-3 ml-auto mr-[20px]">
            <LanguageSelector />
            {user && <NotificationBell />}
            {user ? (
                <>
                   <Link to="/owner-dashboard">
                     <button className="btn-outline text-sm px-4 py-2">
                       <i className="fas fa-chart-line mr-2"></i>
                       {t('header.dashboard')}
                     </button>
                   </Link>
                   <Link to="/messages">
                     <button className="btn-outline text-sm px-4 py-2">
                       <i className="fas fa-comments mr-2"></i>
                       Mensajes
                     </button>
                   </Link>
                   <Link to="/favorites">
                     <button className="btn-outline text-sm px-4 py-2">
                       <i className="fas fa-heart mr-2"></i>
                       Favoritos
                     </button>
                   </Link>
                  <Link to="/list-space">
                    <button className="btn-outline text-sm px-4 py-2">
                      <i className="fas fa-plus mr-2"></i>
                      {t('header.listSpace')}
                    </button>
                  </Link>
                  <Link to="/profile">
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
              <Link to="/auth">
                <button className="btn-primary text-sm px-4 py-2">
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Iniciar Sesión
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground hover:text-primary transition-colors duration-300"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : 'closed'}`}>
          <nav className="py-4 px-4 space-y-4">
            <Link to="/" className="block text-foreground hover:text-primary transition-colors duration-300 font-medium">
              {t('header.home')}
            </Link>
            <Link to="/explore" className="block text-foreground hover:text-primary transition-colors duration-300 font-medium">
              {t('header.explore')}
            </Link>
            <a href="#how-it-works" className="block text-foreground hover:text-primary transition-colors duration-300 font-medium">
              {t('header.howItWorks')}
            </a>
            <Link to="/list-space" className="block text-foreground hover:text-primary transition-colors duration-300 font-medium">
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
                     <Link to="/owner-dashboard">
                       <button className="btn-outline w-full">
                         <i className="fas fa-chart-line mr-2"></i>
                         {t('header.dashboard')}
                       </button>
                     </Link>
                     <Link to="/messages">
                       <button className="btn-outline w-full">
                         <i className="fas fa-comments mr-2"></i>
                         Mensajes
                       </button>
                     </Link>
                     <Link to="/favorites">
                       <button className="btn-outline w-full">
                         <i className="fas fa-heart mr-2"></i>
                         Favoritos
                       </button>
                     </Link>
                    <Link to="/list-space">
                      <button className="btn-outline w-full">
                        <i className="fas fa-plus mr-2"></i>
                        {t('header.listSpace')}
                      </button>
                    </Link>
                    <Link to="/profile">
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
                <Link to="/auth">
                  <button className="btn-primary w-full">
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Iniciar Sesión
                  </button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
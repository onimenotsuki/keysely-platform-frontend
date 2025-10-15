import { useState } from 'react';
import { DesktopNav } from './DesktopNav';
import { HeaderActions } from './HeaderActions';
import { Logo } from './Logo';
import { MobileMenuButton } from './MobileMenuButton';
import { MobileNav } from './MobileNav';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar-sticky">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <DesktopNav />
          <HeaderActions />
          <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
        </div>
        <MobileNav isOpen={isMenuOpen} />
      </div>
    </header>
  );
};

export default Header;

import { useEffect, useState } from 'react';
import { DesktopNav } from './DesktopNav';
import { Logo } from './Logo';
import { MobileMenuButton } from './MobileMenuButton';
import { MobileNav } from './MobileNav';

interface HeaderProps {
  forceScrolled?: boolean;
}

export const Header = ({ forceScrolled = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(forceScrolled);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Add scroll listener to change header background
  useEffect(() => {
    if (forceScrolled) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.85);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [forceScrolled]);

  return (
    <header className={`navbar-sticky ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo isScrolled={isScrolled} />
          <div className="flex items-center ml-auto">
            <DesktopNav isScrolled={isScrolled} />
            <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} isScrolled={isScrolled} />
          </div>
        </div>
        <MobileNav isOpen={isMenuOpen} isScrolled={isScrolled} />
      </div>
    </header>
  );
};

export default Header;

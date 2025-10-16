interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  isScrolled?: boolean;
}

export const MobileMenuButton = ({
  isOpen,
  onClick,
  isScrolled = false,
}: MobileMenuButtonProps) => {
  const iconClass = isScrolled
    ? 'text-foreground hover:text-primary'
    : 'text-white hover:text-white/80';

  return (
    <button
      className={`md:hidden ${iconClass} transition-colors duration-300`}
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
    </button>
  );
};

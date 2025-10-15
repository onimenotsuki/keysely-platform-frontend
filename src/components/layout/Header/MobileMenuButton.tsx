interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => {
  return (
    <button
      className="md:hidden text-foreground hover:text-primary transition-colors duration-300"
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
    </button>
  );
};

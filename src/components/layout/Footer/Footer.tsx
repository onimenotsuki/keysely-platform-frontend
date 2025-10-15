import { CompanyInfo } from './CompanyInfo';
import { CompanyLinks } from './CompanyLinks';
import { DiscoverLinks } from './DiscoverLinks';
import { FooterBottom } from './FooterBottom';
import { SocialLinks } from './SocialLinks';
import { SupportLinks } from './SupportLinks';

export const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container mx-auto px-4">
        <div className="footer-grid">
          <div>
            <CompanyInfo />
            <SocialLinks />
          </div>
          <DiscoverLinks />
          <CompanyLinks />
          <SupportLinks />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
};

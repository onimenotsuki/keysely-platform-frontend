import logoImage from '../assets/logo.png';
import { useTranslation } from '../hooks/useTranslation';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer-section">
      <div className="container mx-auto px-4">
        <div className="footer-grid">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <img src={logoImage} alt="OfiKai Logo" className="h-10 w-auto brightness-0 invert" />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">{t('footer.description')}</p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 text-lg"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 text-lg"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 text-lg"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-300 text-lg"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="footer-title">{t('footer.discover')}</h4>
            <div className="space-y-2">
              <a href="#" className="footer-link">
                {t('categories.privateOffice.title')}
              </a>
              <a href="#" className="footer-link">
                {t('categories.meetingRoom.title')}
              </a>
              <a href="#" className="footer-link">
                {t('categories.coworking.title')}
              </a>
              <a href="#" className="footer-link">
                {t('categories.conference.title')}
              </a>
              <a href="#" className="footer-link">
                {t('footer.spaces')}
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="footer-title">{t('footer.company')}</h4>
            <div className="space-y-2">
              <a href="#" className="footer-link">
                {t('footer.about')}
              </a>
              <a href="#" className="footer-link">
                {t('footer.careers')}
              </a>
              <a href="#" className="footer-link">
                {t('footer.press')}
              </a>
              <a href="#" className="footer-link">
                Blog
              </a>
              <a href="#" className="footer-link">
                Partner Program
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="footer-title">{t('footer.support')}</h4>
            <div className="space-y-2">
              <a href="#" className="footer-link">
                {t('footer.help')}
              </a>
              <a href="#" className="footer-link">
                {t('footer.contact')}
              </a>
              <a href="#" className="footer-link">
                {t('footer.terms')}
              </a>
              <a href="#" className="footer-link">
                Privacy Policy
              </a>
              <a href="#" className="footer-link">
                Trust & Safety
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-12 pt-8 text-center">
          <p className="text-gray-300">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

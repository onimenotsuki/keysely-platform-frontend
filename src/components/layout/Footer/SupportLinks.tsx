import { useTranslation } from '../../../hooks/useTranslation';

export const SupportLinks = () => {
  const { t } = useTranslation();

  return (
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
  );
};

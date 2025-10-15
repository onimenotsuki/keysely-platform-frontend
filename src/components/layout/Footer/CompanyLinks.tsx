import { useTranslation } from '../../../hooks/useTranslation';

export const CompanyLinks = () => {
  const { t } = useTranslation();

  return (
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
  );
};

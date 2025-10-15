import { useTranslation } from '../../../hooks/useTranslation';

export const DiscoverLinks = () => {
  const { t } = useTranslation();

  return (
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
  );
};

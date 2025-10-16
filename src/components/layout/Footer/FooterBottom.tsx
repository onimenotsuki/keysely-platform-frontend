import { useTranslation } from '../../../hooks/useTranslation';

export const FooterBottom = () => {
  const { t } = useTranslation();

  return (
    <div className="border-t bg-primary mt-12 pt-8 text-center">
      <p className="text-gray-300">{t('footer.copyright')}</p>
    </div>
  );
};
